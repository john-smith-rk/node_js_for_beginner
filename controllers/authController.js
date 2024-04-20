const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Json file
// const usersDB = {
//     users : require('../model/users.json'),
//     setUsers: function(data){ this.users = data}

// };
// const fsPromise = require('fs').promises;
// const path = require('path');

// MongoDB
const User = require('../model/User');

const handelLogin = async (req, res)=>{
    const { user, pwd } = req.body;
    if(!user || !pwd){
        return res.status(400).json({ 'status':false, 'message':'Username and Password are required.'});
    }

    // Json file
    // const foundUser = usersDB.users.find(person=> person.username == user);

    // Mongo DB
    const foundUser = await User.findOne({username:user}).exec();

    if(!foundUser) return res.status(401).json({ 'status':false, 'message': `User [${user}] has not registered yet.`}); 

    try{

        const match = await bcrypt.compare(pwd, foundUser.password);

        if(match){
            const roles = Object.values(foundUser.roles);
            // Create JWT 
            const accessToken = jwt.sign(
                {
                     "UserInfo":{
                     'username' : foundUser.username,
                     "roles":roles
                    }
               },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '30m'}
            )

            const refreshToken = jwt.sign(
                { 'username' : foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn : '1d'}
            )

            // Json file
            // Saving RefreshToken With Current User
            // const otherUsers = usersDB.users.filter(person=> person.username != foundUser.username);
            // const currentUser = {...foundUser, refreshToken};
            // usersDB.setUsers([...otherUsers, currentUser]);
            // await fsPromise.writeFile(
            //     path.join(__dirname,'..', 'model', 'users.json'),
            //     JSON.stringify(usersDB.users)
            // );

            // MongoDB
            foundUser.refreshToken = refreshToken;
            const result = foundUser.save();
            console.log(result);

            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge:24 * 60 * 60 * 1000});

            return res.status(200).json({ 'status':true,
             'message': `User [${user}] is logged in successfully.`,
              'access_token':accessToken
        }); 
        }else{
            return res.status(401).json({ 'status':false, 'message': `Password is incorrect. Please check your password again.`,}); 
        }
    }catch(err){
        console.log(`Login>> ${err}`);
        return res.status(500).json({ 'status':false, 'message': err.message}); 
    }
};

module.exports = { handelLogin };