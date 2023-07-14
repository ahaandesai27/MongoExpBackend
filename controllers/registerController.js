const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

//set usersDB.users to the users array in users.json
const usersDB = {
    users: require('../models/users'),
    setUsers: function (users) { this.users = users; }
} 
const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(400).send('Missing username or password');
        return;
    }
    //check for duplicate username in DB
    const duplicate = usersDB.users.find(user => user.username === username);
    if(duplicate) { 
        res.status(409).send('Username already exists');
        return;
    }
    try {
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //add new user to DB
        usersDB.users.push({ username, password: hashedPassword });
        //update DB file
        await fsPromises.writeFile(path.join(__dirname, '../models/users.json'), JSON.stringify(usersDB.users));    
        res.status(201).send(`New user ${username} created!`);
    }
    catch (err) {
        res.status(500).send(`error: ${err.message}`);
    }
}

module.exports =  handleNewUser;