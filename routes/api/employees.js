const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

const {getAllEmployees, 
    createNewEmployee, 
    updateEmployee, 
    deleteEmployee, 
    getEmployeeById} = employeesController;

router.route('/')
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR),createNewEmployee);

router.route('/:id')
    .get(getEmployeeById)
    .put(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR),updateEmployee)
    .delete(verifyRoles(ROLES_LIST.ADMIN),deleteEmployee);;

module.exports = router;