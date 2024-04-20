
// Json File
// const fs = require('fs');
// const path = require('path');
// const data = {
//     employees : require('../model/employees.json'),
//     setEmployees: function(data){ this.employees = data}
// };

const Employee = require('../model/Employee');

const getALlEmployees = async (req, res)=>{
   
    // Json file
    // res.json(data.employees);

    // MongoDB
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({ 'status':false, 'message':'No employees found.'});
    res.json(employees);
};

const createNewEmployees = async (req, res)=>{
    //Json file
    // const newEmployee = {
    //     id : data.employees[data.employees.length-1].id+1 || 1,
    //     firstname : req.body.firstname,
    //     lastname : req.body.lastname
    // }
    // if(!newEmployee.firstname || !newEmployee.lastname){
    //     return res.status(400).json({ 'status':false, 'message':'First-name and last-name are required.'});
    // }
    //data.setEmployees([...data.employees, newEmployee]);
    //  saveFiles();
    
    // Mongo DB
    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({ 'status':false, 'message':'First-name and last-name are required.'});
    }

    try{

        const result = await Employee.create({
            firstname : req.body.firstname,
            lastname : req.body.lastname
        });

        console.log(result);

        res.status(201).json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ 'status':false, 'message': `Retrieve : ${err}`});
    }


   
};

const updateEmployees = async (req, res)=>{
    if(!req.body.id){
        return res.status(400).json({ 'status':false, 'message':'Please provide the employee\'s id.'});
    }

    // Json file
    // const employee = data.employees.find(emp=> emp.id == parseInt(req.body.id));

    try{
        //MongoDB
        const employee = await Employee.findOne({_id:req.body.id});
        if(!employee){
            return res.status(400).json({ 'status':false, 'message':`Employee ID [${req.body.id}] is not found.`});
        }

        if(req.body.firstname) employee.firstname = req.body.firstname;
        if(req.body.lastname) employee.lastname = req.body.lastname;

        // Json file
        // const filteredArray = data.employees.filter(emp=> emp.id != parseInt(req.body.id));
        // const unsortedArray = [...filteredArray, employee];
        // data.setEmployees(unsortedArray.sort((a,b)=>a.id>b.id ? 1: a.id < b.id ? -1:0 ));
        // saveFiles();

        //MongoDB
        const result = await employee.save();
        console.log(result);

        res.status(200).json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ 'status':false, 'message': `Update : ${err}`});
    }

    

};

const deleteEmployees = async (req, res)=>{
    if(!req.body.id){
        return res.status(400).json({ 'status':false, 'message':'Please provide the employee\'s id.'});
    }

    // Json file
    // const employee = data.employees.find(emp=> emp.id == parseInt(req.body.id));

    try{
        // MongoDB
        const employee = await Employee.findOne({_id:req.body.id});

        if(!employee){
            return res.status(400).json({ 'status':false, 'message':`Employee ID [${req.body.id}] is not found.`});
        }

        // Json file
        // const filteredArray = data.employees.filter(emp=> emp.id != parseInt(req.body.id));
        // data.setEmployees([...filteredArray]);
        // saveFiles();

        // MongoDB
        const result = await employee.deleteOne({_id: req.body.id});
        res.status(200).json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ 'status':false, 'message': `Delete : ${err}`});
    }
   

};

const getEmployee = async(req, res)=>{
    if(!req.params.id){
        return res.status(400).json({ 'status':false, 'message':'Please provide the employee\'s id.'});
    }

    // Json file
    // const employee = data.employees.find(emp=> emp.id == parseInt(req.body.id));

    // MongoDB

    try{

        const employee = await Employee.findOne({_id:req.params.id});
        if(!employee){
            return res.status(400).json({ 'status':false, 'message':`Employee ID [${req.body.id}] is not found.`});
        }
    
        res.status(200).json(employee);
    }catch(err){
        console.error(err);
        res.status(500).json({ 'status':false, 'message': `Retrieve One : ${err}`});

    }

  

};

// const saveFiles = ()=> {
//     try {
//         const jsonData = JSON.stringify(data.employees);
//         fs.writeFileSync( path.join(__dirname,'..','model', 'employees.json'), jsonData);
//         console.log('JSON data saved to file successfully.');
//       } catch (error) {
//         console.error('Error writing JSON data to file:', error);
//       }
// };

module.exports = { 
    getALlEmployees, 
    createNewEmployees, 
    updateEmployees, 
    deleteEmployees, 
    getEmployee 
};