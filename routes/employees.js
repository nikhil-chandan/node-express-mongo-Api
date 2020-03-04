const express = require('express');
const router = express.Router();
const service = require('../services/employee_service');
const Employee = require('../models/employee');
const wrap = require('co-express');


//all employee routes
router.post('/', service.postEmployee);
router.get('/', service.getAllEmployees);
router.get('/:id', service.getEmployeeById);
router.post("/:id/restore", service.restoreEmployee)
router.patch("/:id", service.patchEmployee);
router.delete("/:id", service.deleteEmployee);

//using co-express, generator function
// router.get('/', wrap(function*(req,res){
//     var attr = 'firstName lastName address mobileNo designation location employeeId'
//     var  employees =  yield Employee.find(null, attr).exec()
//     res.json(employees)
// }))

module.exports = router;