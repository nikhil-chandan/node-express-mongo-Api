const Employee = require('../models/employee');
const Q = require('Q');
const select = require('mongo-select').select();
const projection = select.exclude(['_id', '__v']);
const logModule = require('../startup/logging');
const logger = logModule.logger;

function getEmpId() {
    const deferred = Q.defer();
    try {
        Employee.find().sort({
                employeeId: -1
            }).limit(1)
            .then(lastEmpId => {
                if (lastEmpId) {
                    lastEmpId = lastEmpId[0].employeeId + 1;
                    console.log(lastEmpId);
                    deferred.resolve(lastEmpId);
                } else {
                    lastEmpId = 1;
                    deferred.resolve(lastEmpId);
                }
            });
        return deferred.promise;
    } catch (err) {
        logger.error('Unable to get new emp id ' + err.name);
        console.log(err)
    }
}

const postEmployee = async (req, res) => {
    try {
        getEmpId().then(async function (empId) {
            const employee = new Employee({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                mobileNo: req.body.mobileNo,
                employeeId: parseInt(empId),
                designation: req.body.designation,
                location: req.body.location,
            });

            await employee.save();
            Employee.find({
                    employeeId: parseInt(empId)
                }, projection)
                .then(savedEmployee => {
                    if (savedEmployee) {
                        res.json({
                            "data": savedEmployee[0],
                            "message": `Employee Created with emp id ${empId}`
                        });
                    }
                })
            logger.info(`Employee Details Added with emp id ${empId}`);
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

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({
            "isDeleted": false
        }, projection);
        res.json({
            data: employees,
            message: "All employee data"
        });
        logger.info('Employee Details Requested');
    } catch (err) {
        logger.error('Employee Details Fetching Error ' + err.name)
        res.json({
            message: err
        });
    }
}

const getEmployeeById = async (req, res) => {
    const empId = parseInt(req.params.id);
    try {
        const employees = await Employee.find({
            employeeId: empId
        }, projection);
        if (employees.length == 0) {
            res.json({
                "message": "No employee found"
            });
            logger.error('Employee details not exsits for emp id ' + empId)
        }else if(employees.length == 1){
            res.json({
                data: employees,
                message: "Employee found"
            });
            logger.info('Employee Details fetched for emp id ' + empId);
        }
    } catch (err) {
        res.json({
            message: err
        });
        logger.error('Employee details not fetched' + err.name)
    }
}

const restoreEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeId: req.params.id
        });
        employee.isDeleted = false;
        await employee.save();
        res.json({
            data: true,
            message: "Restored"
        });
        //  res.status(200).send("Restored");
        logger.info('Employee Details restored with id ' + req.params.id);
    } catch (err) {
        logger.error('Employee Details not restored with id ' + req.params.id + err.name);
        res.json({
            message: err
        });
    }
}



const patchEmployee = async (req, res) => {
    const empId = parseInt(req.params.id);
    try {
        Employee.findOneAndUpdate({
            employeeId: empId
        }, req.body, {
            new: true
        }, (err) => {
            if (err) {
                console.log("Something wrong when updating data!" + err);
            }
            res.json({
                data: empId,
                message: "Employee Updated Successfully"
            });
        });
        logger.info('Employee Details patched with id ' + empId);
    } catch (err) {
        logger.error('Employee Details not patched with id ' + empId + err.name);
        res.json({
            message: err
        });
    }
}



const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeId: req.params.id
        });
        employee.isDeleted = true;
        await employee.save();
        res.json({
            data: req.params.id,
            message: "Employee Deleted Successfully"
        });
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