const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;