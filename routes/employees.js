const express = require('express');
const router = express.Router();
const service = require('../services/employee_service');


//all employee routes
router.post('/', service.postEmployee);
router.get('/', service.getAllEmployees);
router.get('/:id', service.getEmployeeById);
router.post("/:id/restore", service.restoreEmployee)
router.patch("/:id", service.patchEmployee);
router.delete("/:id", service.deleteEmployee);

module.exports = router;