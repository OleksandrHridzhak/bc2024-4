const {program} = require('commander');
const http = require('http');

program
    .requiredOption('-h, --host <value>')
    .requiredOption('-p, --port <value>')
    // .requiredOption('-c,--cache <file>');
 
    
program.parse();
const options = program.opts();


const host = options.host;
const port = options.port;

const requestListener = function(req,res) {

    res.writeHead(200);
    res.end("MY FIRST SERVER");
};

const server = http.createServer(requestListener);

server.listen(port,host);



