
// Json file
// const usersDB = {
//     users : require('../model/users.json'),
//     setUsers: function(data){ this.users = data}
// };

//MongoDB

const User = require('../model/User');
const jwt = require('jsonwebtoken');


const handelRefreshToken = async (req, res)=>{
    const cookies = req.cookies;

    if(!cookies?.jwt){
        return res.status(401).json({ 'status':false, 'message':'Token is expired.'});
    }

    console.log(cookies);
    const refreshToken = cookies.jwt;

    // Json file
    // const foundUser = usersDB.users.find(person=> person.refreshToken == refreshToken);

    //Mongo DB
    const foundUser = await User.findOne({refreshToken:refreshToken}).exec();

    if(!foundUser) return res.status(403).json({ 'status':false, 'message': `Token is invalid to refresh.`}); 

    try{

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded)=>{
              if(err || foundUser.username != decoded.username) res.status(403).json({ 'status':false, 'message': `Token is invalid to refresh.`});
           
              const roles = Object.values(foundUser.roles);
              const accessToken = jwt.sign(
                { 
                    "UserInfo":{
                        'username' : decoded.username,
                        "roles":roles
                       }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '30m'}
            );

            return res.status(200).json({ 'status':true,
            'message': `Token is refreshed successfully.`,
             'access_token':accessToken}); 

            }

        );

    }catch(err){
        return res.status(500).json({ 'status':false, 'message': err.message}); 
    }
};

module.exports = { handelRefreshToken };