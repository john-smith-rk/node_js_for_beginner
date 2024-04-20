
const bcrypt = require('bcrypt');

// For MongoDB
const User = require('../model/User');

// For Json
// const usersDB = {
//     users : require('../model/users.json'),
//     setUsers: function(data){ this.users = data}
// };
// const fsPromise = require('fs').promises;
// const path = require('path');

const handleNewUser = async (req, res)=>{
    const { user, pwd } = req.body;
    if(!user || !pwd){
        return res.status(400).json({ 'status':false, 'message':'Username and Password are required.'});
    }

    // Json file
    // const duplicate = usersDB.users.find(person=> person.username == user);

    // Mongo DB
    const duplicate = await User.findOne({username:user}).exec();

    if(duplicate) return res.status(409).json({ 'status':false, 'message':'Username are already taken.'}); /// conflict

    try{
        /// Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd,10);

        // Json file
        // Store the new user
        // const newUser = {
        //     'username':user,
        //     'roles': {'User': 2001 },
        //     'password':hashedPwd };
        // usersDB.setUsers([...usersDB.users, newUser ]);
        //  await fsPromise.writeFile(
        //     path.join(__dirname,'..','model','users.json'), JSON.stringify(usersDB.users)
        // );
        // console.log(usersDB.users);

        // Mongo
        const result = await User.create({
            'username':user,
            'roles': {
                'User': 2001,
                // 'Admin': 5150,
                // 'Editor':1984
            },
            'password':hashedPwd });

        console.log(result);
       
        res.status(201).json({ 'status':true, 'message':`New user [${user}] is created.`});

    }catch(err){
        return res.status(500).json({ 'status':false, 'message':err.message});
    }

}

module.exports = { handleNewUser };