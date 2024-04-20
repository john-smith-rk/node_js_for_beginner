const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;


const logEvents = require("./logEvents");
const EventEmitter = require('events');
const { log } = require('console');
class MyEmitter extends EventEmitter{};

// initialize object
const myEmitter = new MyEmitter();

myEmitter.on('log1', (msg, fileName)=>logEvents(msg,fileName) );

const PORT = process.env.PORT || 3500

const serveFile = async(filePath, contentType, response) => {
    try{

     const rawData = await fsPromise.readFile(filePath,
        !contentType.includes('image')?'utf8':'');

     const data = contentType ==  'application/json'?JSON.parse(rawData):rawData;

     response.writeHead(filePath.includes('404.html')?404:200,{ 'Content-Type': contentType });
     response.end(contentType == 'application/json'?JSON.stringify(data):data);
    }catch(err){
        console.log(err);
        myEmitter.emit("log1", `${err.name}\t${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {

    console.log(req.url, req.method);
    myEmitter.emit("log1", `${req.url}\t${req.method}`, 'reqLog.txt');

    let filePath;

    const extension = path.extname(req.url);
    console.log(extension);
    let contentType;

    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break; 
        case '.json':
            contentType = 'application/json';
            break;         
        case '.jpg':
            contentType = 'imgae/jpeg';
            break;  
        case '.png':
            contentType = 'image/png';
            break;   
        case '.txt':
            contentType = 'text/plain';
            break;      
        default:
            contentType = 'text/html';
            break;       
    }

    filePath = contentType == 'text/html' && req.url == '/'
                ?path.join(__dirname,'views','index.html')
                : contentType == 'text.html' && req.url.slice(-1) == '/'
                    ?path.join(__dirname,'views',req.url,'index.html')
                    :contentType == 'text/html'
                        ?path.join(__dirname,'views',req.url)
                        :path.join(__dirname,req.url);

    // Makes .html extension not required in the browser
    if(!extension && req.url.slice(-1) != '/') filePath +='.html';

    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        // serve the file
        serveFile(filePath, contentType, res);
    }else{
        //404
        //401 redirect
        console.log(path.parse(filePath).base);
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301,{ 'Location' : '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301,{'Location':'/'});
                res.end();
                break;
            default:
                serveFile(path.join(__dirname,'views','404.html'), 'text/html', res);
                        
        }
    }
        
});
server.listen(PORT ,()=>console.log(`Server running on port ${PORT}`));


