const readline = require('readline');

const fs = require('fs');

// Read line Lature

// const rl = readline.createInterface({
//     input:process.stdin,
//     output: process.stdout
// }
// );

// rl.question( "Please enter your name : ",(name)=>{

//     console.log(`You entered name : ${name}`)

//     rl.close();

// } );

// rl.on('close', ()=>{
//     console.log('Interface close');
//     process.exit(1);
// });

// Read File

let value = fs.readFileSync('./logs/reqLog.txt', 'utf-8');
console.log(value);

fs.writeFileSync('./logs/output.txt',value );