
const { logEvents } = require('./logEvents');
const errorHandler = (err, req, res, next)=>{
    logEvents(`${err.name}\t:\t${err.message}\t\t${req.headers.origin}\t${req.url}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
  };

  module.exports = errorHandler;