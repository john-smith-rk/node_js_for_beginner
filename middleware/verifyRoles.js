const verifyRoles = (...allowedRoles)=>{
    return (req, res, next) => {

        if(!req.roles){
            return res.status(401).json({ 'status':false, 'message':'You are not authorized. as your are not in permissions.'});
        }

        const rolesArray =  [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);

        const result =  req.roles.map(role=> rolesArray.includes(role)).find(val=>val==true);
        if(!result) return res.status(401).json({ 'status':false, 'message':'You are not authorized to update/create this.'});

        console.log(result);
        next();
    }
}

module.exports = verifyRoles;