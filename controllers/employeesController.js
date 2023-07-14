const fs = require('fs');
const filePath = `/home/shaun/Documents/JPMC/express_intro/data/employees.json`;
const data = fs.readFileSync(filePath, 'utf-8');
const employeeList = JSON.parse(data);

//get all employees
const getAllEmployees = (req, res) => {
    res.json(employeeList);
}
//create new ID and add to list
const createNewEmployee = async (req, res) => {
    const newEmployee = {
        id: employeeList.length + 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if(!newEmployee.firstname || !newEmployee.lastname) {
        res.status(400).json({error: 'Please include both first and last name'});
    }

    employeeList.push(newEmployee);
    const modifiedData = JSON.stringify(employeeList);
    await fs.writeFileSync(filePath, modifiedData, 'utf-8');
    res.status(201).json(employeeList);
}
//find by ID and update
const updateEmployee = async (req, res) => {
    const id = req.params.id;
    const employee = employeeList.find((employee) => employee.id === parseInt(id));
    if(!employee) {
        res.status(400).json({error: 'Employee not found'});
    } else {
        if(req.body.firstname) {
            employee.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            employee.lastname = req.body.lastname;
        }
        const modifiedData = JSON.stringify(employeeList);
        await fs.writeFileSync(filePath, modifiedData, 'utf-8');
        res.json(employeeList);
    }
}
//find by ID and delete
const deleteEmployee = async (req, res) => {
    const id = req.params.id;
    const employee = employeeList.find((employee) => employee.id === parseInt(id));
    if(!employee) {
        res.status(400).json({error: 'Employee not found'});
    } else {
        const index = employeeList.indexOf(employee);
        employeeList.splice(index, 1);
        const modifiedData = JSON.stringify(employeeList);
        await fs.writeFileSync(filePath, modifiedData, 'utf-8');
        res.json(employeeList);
    }
}
//find by ID and return
const getEmployeeById = async (req, res) => {
    const id = req.params.id;
    const employee = employeeList.find((employee) => employee.id === parseInt(id));
    if(!employee) {
        res.status(404).json({error: 'Employee not found'});
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