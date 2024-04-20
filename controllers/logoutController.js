
// Json file
// const usersDB = {
//     users : require('../model/users.json'),
//     setUsers: function(data){ this.users = data}

// };
// const fsPromises = require('fs').promises;
// const path = require('path');

//MongoDB
const User = require('../model/User');

const handelLogout = async (req, res)=>{
    const cookies = req.cookies;

    if(!cookies?.jwt){
        return res.status(401).json({ 'status':false, 'message':'Token is expired.'});
    }

    console.log(cookies);
    const refreshToken = cookies.jwt;

    // Json file
    // const foundUser = usersDB.users.find(person=> person.refreshToken == refreshToken);

    // MongoDB
    const foundUser = await User.findOne({refreshToken:refreshToken}).exec();

    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly : true, sameSites:'None', secure:true,});
        return res.status(204).json({ 'status':false, 'message': `Token is invalid to refresh.`}); 
    }

    try{
        // Json file
        //  const otherUsers = usersDB.users.filter(person => person.refreshToken != foundUser.refreshToken);
        //  const currentUser = { ...foundUser, refreshToken:''};
        //  usersDB.setUsers([...otherUsers, currentUser]);
        //  await fsPromises.writeFile(
        //     path.join(__dirname, '..','model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        //  );

        // MongoDB
        foundUser.refreshToken = '';
        const result = await foundUser.save();

        console.log(result);
        
        res.clearCookie();
        res.clearCookie('jwt', {httpOnly : true, sameSites:'None', secure:true});
        res.status(401).json({ 'status':false, 'message': `Logout successfully.`}); 

    }catch(err){
        return res.status(500).json({ 'status':false, 'message': err.message}); 
    }
};

module.exports = { handelLogout };