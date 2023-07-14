const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    //check for access token in header
    const authHeader = req.headers['authorization']
    if(!authHeader) {
        res.status(401).send('Access denied, token missing');
        return;
    }
    //verify header token with secret key
    console.log(authHeader);
    const accessToken = authHeader.split(' ')[1]; //get token number from {Bearer <token>}
    jwt.verify(
        accessToken, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                res.status(403).send('Invalid token');
            }
            req.user = decoded.username;
            next();
    });
}

module.exports = verifyJWT;