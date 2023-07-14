const express = require('express');
const router = express.Router();
const fs = require('fs');
const filePath = `/home/shaun/Documents/JPMC/express_intro/data/employees.json`;
const data = fs.readFileSync(filePath, 'utf-8');
const employeeList = JSON.parse(data);

router.route('/')
    .get((req, res) => {
          res.json(employeeList);
    })
    .post(async (req, res) => {
           const newEmployee = {
               id: employeeList.length + 1,
               firstname: req.body.firstname,
               lastname: req.body.lastname
           }
           employeeList.push(newEmployee);
           const modifiedData = JSON.stringify(employeeList);
           await fs.writeFileSync(filePath, modifiedData, 'utf-8');
           res.json(employeeList);
    })
    .put(async (req, res) => {
        res.json({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
    })
    .delete(async (req, res) => {
        res.json({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
    });

router.route('/:id')
    .get((req, res) => {
        const id = req.params.id;
        const employee = employeeList.find((employee) => employee.id === parseInt(id));
        if(!employee) {
            res.status(404).json({error: 'Employee not found'});
        } else {
            res.json(employee);
        }
    });

module.exports = router;