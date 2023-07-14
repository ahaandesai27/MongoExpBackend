const fsPromises = require('fs').promises;
const { appendFileSync } = require('fs');
const path = require('path');

//set usersDB.users to the users array in users.json
const usersDB = {
    users: require('../models/users'),
    setUsers: function (users) { this.users = users; }
} 
const handleLogout = async (req, res) => {
    // Note for Frontend: on client also delete the access token
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    //Is refreshToken in DB?
    const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);
    if(!foundUser) { //no user but cookie exists
        res.clearCookie('jwt', {httpOnly: true, sameSite:'None', secure:true});
        return res.sendStatus(204);
    }
    foundUser.refreshToken = null;
    usersDB.setUsers(usersDB.users);
    await fsPromises.writeFile(path.join(__dirname, '../models/users.json'), JSON.stringify(usersDB.users))
    res.clearCookie('jwt', {httpOnly: true, sameSite:'None', secure:true});
    res.sendStatus(204);
}

module.exports =  handleLogout;