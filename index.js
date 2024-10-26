const { program } = require('commander');
const http = require('http');
const fs = require('fs');
const path = require('path');

program
    .requiredOption('-h, --host <host>')
    .requiredOption('-p, --port <port>')
    .requiredOption('-c, --cache <file>');

program.parse();
const options = program.opts();

const host = options.host;
const port = options.port;
const cache = options.cache;

const requestListener = async (req, res) => {
    const imgIndex = req.url.slice(1);
    const imgPath = path.join(cache, `${imgIndex}.jpg`);

    if (req.method === 'GET') {
        
    } else if (req.method === 'PUT') {
        
    } else if (req.method === 'DELETE') {
        try {
            await fs.promises.unlink(filePath);
            res.log(200)
        } catch(error){
            res.end(404)
        }
    } else {
        
    }

    res.end("MY FIRST SERVER");
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {

});
