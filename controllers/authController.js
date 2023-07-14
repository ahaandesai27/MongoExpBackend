const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(400).send('Missing username or password');
        return;
    }
    //check for username in DB
    const foundUser = await User.findOne({username}).exec();
    if(!foundUser) {
        res.status(401).send('Username or password is incorrect');
        return;
    }
    try {
        //compare password
        const match = await bcrypt.compare(password, foundUser.password);
        if(match) {
            const roles = Object.values(foundUser.roles);
            //create JWTs
            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": foundUser.username, 
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: '3d'}
            );
            const refreshToken = jwt.sign(
                {
                    "userInfo": {
                        "username": foundUser.username, 
                        "roles": roles
                    }
                }, 
                process.env.REFRESH_TOKEN_SECRET, 
                {expiresIn: '15d'}
            );

            //save refresh token to current user
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
            console.log(result);
            if(!result) {
                res.status(500).send('Error saving refresh token');
                return;
            }
            //SET TO "SECURE: TRUE" WHEN DEPLOYING TO HTTPS
            //SET SAME SITE TO "NONE" WHEN DEPLOYING TO HTTPS
            //res.cookie('jwt', refreshToken, {httpOnly: true, sameSite:'None', secure:true, maxAge: 24*60*60*1000});
            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000});
            res.status(200).json({accessToken});
        }
        else {
            res.status(401).send('Username or password is incorrect');
            return;
        }
    }
    catch (err) {
        res.status(500).send(`error: ${err.message}`);
    }
}

module.exports =  handleLogin;