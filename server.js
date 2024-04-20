require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const logEvents = require('./middleware/logEvents');
const errorHandlers = require('./middleware/errorhandlers');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentils = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3600


// Connect to MongoDB
connectDB();

//custom middleware logger
app.use(logEvents.logger);

//Handle credential checks befor CROS
// fetch cookie credentils requirement
app.use(credentils)

// Cross origin Resource sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlencode data
// in other words, form-data
// 'content-type' :'application/x-ww-form-urlencoded'
app.use(express.urlencoded({extended:false}));

// built-in middleware for json
app.use(express.json());

/// Middleware for Cookies
app.use(cookieParser());

// serve static files
app.use('/',express.static(path.join(__dirname,'/public')))

// serve static files for sub directory
app.use('/subdir', express.static(path.join(__dirname,'/public')))


// middleware for routes
app.use('/', require('./routes/root'));
// Middleware for sub directory for routes
app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

app.use(verifyJWT.verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.get('*', (req, res)=>{
   res.status(404);
    if(req.accepts(html)){
      res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
      res.json({
         error:'404 Not Found'
      });
    }else{
      res.type('txt').send('404 Not Found');
    }
    
 });

app.use(errorHandlers);

mongoose.connection.once('open', () =>{

  console.log('Connected to MongoDB');

  app.listen(PORT ,()=>console.log(`Server running on port ${PORT}`));
  
});

//app.listen(PORT ,()=>console.log(`Server running on port ${PORT}`));


