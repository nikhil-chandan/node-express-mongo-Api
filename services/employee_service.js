const Employee = require('../models/employee');
var Q = require('Q');
const express = require('express');
const winston = require('winston');
const app = express();
const { createLogger, format, transports} = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
var select = require('mongo-select').select();
var projection = select.include(['firstName', 'lastName', 'address', 'mobileNo', 
                                 'employeeId','designation','location']);

const logger = winston.createLogger({
    format: combine(
        label({
            label: 'test label'
        }),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.File({
            filename: 'info.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error'
        })
    ]
});

function getEmpId() {
    var deferred = Q.defer();
    try {
        Employee
            .estimatedDocumentCount()
            .then(countEmp => {
                if (countEmp) {
                    countEmp = countEmp + 1;
                    console.log(countEmp)
                    deferred.resolve(countEmp);
                } else {
                    //if no emp in db
                    countEmp = 1;
                    deferred.resolve(countEmp);
                }
            })
        return deferred.promise;
    } catch (err) {
        logger.error('Unable to get new emp id ' + err.name)
        console.log(err)
    }
}

var postEmployee = async (req, res) => {
    try {
        getEmpId().then(async function (countEmp) {
            const employee = new Employee({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                mobileNo: req.body.mobileNo,
                employeeId: parseInt(countEmp),
                designation: req.body.designation,
                location: req.body.location,
            });
            const savedEmployee = await employee.save();
            res.json(savedEmployee);
            logger.info('Employee Details Added with emp id ' + countEmp)
        }).fail(function (err) {
            console.log(err)
        });
    } catch (err) {
        logger.error('Employee were not added' + err.name)
        res.json({
            message: err
        });
    }
}

var getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}, projection);
        res.json(employees);
        logger.info('Employee Details Requested');
    } catch (err) {
        logger.info('Employee Details Fetching Error ' + err.name)
        res.json({
            message: err
        });
    }
}

var getEmployeeById = async (req, res) => {
    var empId = parseInt(req.params.id);
    try {
        const employees = await Employee.find({}, projection);
        var filterEmp = employees.filter(function (row) {
            if (row.employeeId == empId) {
                return true
            } else {
                return false;
            }
        });
        logger.info('Employee Details fetched for emp id ' + empId);
        if(filterEmp.length == 0){
            logger.error('Employee details not exsits for emp id ' + empId)
        }
        res.json(filterEmp);
    } catch (err) {
        logger.error('Employee details not fetched' + err.name)
        res.json({
            message: err
        });
    }
}

var restoreEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            _id: req.params.id
        });
        employee.isDeleted = false;
        await employee.save();
        res.status(200).send();
        logger.info('Employee Details restored with id ' + req.params.id);
    } catch (err) {
        logger.error('Employee Details not restored with id ' + req.params.id + err.name);
        res.json({
            message: err
        });
    }
}

var patchEmployee = async (req, res) => {
    var empId = parseInt(req.params.id);
    try {
        Employee.findOneAndUpdate({
            employeeId: empId
        }, req.body, {
            new: true
        }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!" + err);
            }
            res.json(doc);
        });
        logger.info('Employee Details patched with id ' + empId);
    } catch (err) {
        logger.error('Employee Details not patched with id ' + empId + err.name);
        res.json({
            message: err
        });
    }
}

var deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            _id: req.params.id
        });
        employee.isDeleted = true;
        await employee.save();
        res.status(200).send();
        logger.info('Employee Details deleted with id ' + req.params.id);
    } catch (err) {
        res.json({
            message: err
        });
    }
}

module.exports = {
    postEmployee: postEmployee,
    getAllEmployees: getAllEmployees,
    getEmployeeById: getEmployeeById,
    patchEmployee: patchEmployee,
    deleteEmployee: deleteEmployee,
    restoreEmployee: restoreEmployee
}