const Employee = require('../models/Employee');

//get all employees
const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if(!employees) {
        res.status(204).json({error: 'No employees found'});
    }
    res.json(employees);
}
//create new ID and add to list
const createNewEmployee = async (req, res) => {
    if(!req?.body.firstname || !req?.body.lastname) {
        res.status(400).json({error: 'Please include both first and last name'});
    }
    try {
        console.log(req.body.firstName);
        console.log(req.body.lastName);
        const newEmployee = new Employee({
            firstName: req.body.firstname,
            lastName: req.body.lastname
        });
        console.log(newEmployee);
        const result = await newEmployee.save();
        console.log(result)
        res.status(201).json(result);
    }
    catch(err) {
        res.status(500).json({error: err});
    }
}
//find by ID and update
const updateEmployee = async (req, res) => {
    if(!req?.params?.id) {
        res.status(400).json({error: 'Please include employee ID'});
    }
    const id = req.params.id;
    const employee = await Employee.findOne({_id: id}).exec();
    if(!employee) {
        res.status(204).json({error: `No employee with id ${id}`});
    } else {
        if(req.body?.firstName) {
            employee.firstName = req.body.firstName;
        }
        if(req.body?.lastName) {
            employee.lastName = req.body.lastName;
        }
        const result = await employee.save();
        console.log(result);
        res.json(result);
    }
}
//find by ID and delete
const deleteEmployee = async (req, res) => {
    if(!req?.params?.id) {
        res.status(400).json({error: 'Please include employee ID'});
    }
    const id = req.params.id;
    const employee = await Employee.findOne({_id: id}).exec();
    if(!employee) {
        res.status(204).json({error: `No employee with id ${id}`});
    } else {
        const result = await employee.deleteOne({_id: id});
        res.json(result);
    }
}   
//find by ID and return
const getEmployeeById = async (req, res) => {
    if(!req?.params?.id) {
        res.status(400).json({error: 'Please include employee ID'});
    } 
    const id = req.params.id;
    const employee = await Employee.findOne({_id: id}).exec();
    if(!employee) {
        res.status(204).json({error: `No employee with id ${id}`});
    } else {
        res.json(employee);
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
}