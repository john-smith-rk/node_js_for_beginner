const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next)=>{

    //const authHeader = req.headers['authorization'];

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({ 'status':false, 'message':'You are not authorized.'});
    }

    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];

    jwt.verify(
       token,
       process.env.ACCESS_TOKEN_SECRET,
       (err, decoded)=>{
            if(err)  return res.status(403).json({ 'status':false, 'message':'Authorization failed.'}); // Invalid Token
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
       }
    );

};

module.exports = {verifyJWT};