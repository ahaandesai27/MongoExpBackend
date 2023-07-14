const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    //check for username in DB
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser) return res.sendStatus(403);
    try {
        //compare refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
                
                const roles = Object.values(foundUser.roles);
                const accessToken = jwt.sign(
                    {
                        "userInfo":{
                            "username": foundUser.username,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '30s'}
                );
                res.status(200).json({accessToken});
            }
        );
    }
    catch (err) {
        res.status(500).send(`error: ${err.message}`);
    }
}

module.exports =  handleRefreshToken;