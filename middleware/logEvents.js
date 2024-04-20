console.log("Write....")

const {format} = require("date-fns");
const { v4 : uuid}= require("uuid");


const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const logEvents = async (message, fileName)=>{

    const datetime =  format(new Date(), "yyyy MMMM dd\tHH:mm:ss");
    const logItem = datetime+'\t'+uuid()+'\t'+message+'\n';
    console.log(logItem);
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromise.mkdir(path.join(__dirname,'..','logs'));
        }
        await fsPromise.appendFile(path.join(__dirname,'..','logs', fileName), logItem);
    }catch(err){
        console.error(err);
    }
}

const logger = (req, res, next)=>{
   logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
   console.log(`${req.method}\t${req.path}`);
   
   next();
 };

//module.exports = logEvents;
module.exports= { logger, logEvents};