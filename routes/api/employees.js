const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

const {getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployeeById} = employeesController;

router.route('/')
    .get(getAllEmployees)
    .post(createNewEmployee);

router.route('/:id')
    .get(getEmployeeById)
    .put(updateEmployee)
    .delete(deleteEmployee);;

module.exports = router;