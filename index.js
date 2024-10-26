const { program } = require('commander');
const http = require('http');
const fs = require('fs');
const path = require('path');

//CMD PARSER ---
program.requiredOption('-h, --host <host>')
program.requiredOption('-p, --port <port>')
program.requiredOption('-c, --cache <file>');
program.parse();
const options = program.opts();

const host = options.host;
const port = options.port;
const cache = options.cache;

//SERVER ---
const requestListener = async (req, res) => {

    const imgIndex = req.url.slice(1);
    const imgPath = path.join(cache, `${imgIndex}.jpg`);

    if (req.method === 'GET') {
        try{
            const data = await fs.promises.readFile(imgPath);
            res.writeHead(200,{ 'Content-Type': 'image/jpeg' });
            res.end(data);
        }catch{
            res.writeHead(404);
            res.end()
        }

    } else if (req.method === 'PUT') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', async () => {
            body = Buffer.concat(body);
            try {
                await fs.promises.mkdir(path.dirname(imgPath), { recursive: true });
                await fs.promises.writeFile(imgPath, body);
                res.writeHead(201);
                res.end()
            } catch {
                res.writeHead(500);
                res.end()
            }
        });

    } else if (req.method === 'DELETE') {
        try {
            await fs.promises.unlink(imgPath);
            res.writeHead(200);
            res.end()
        } catch {
            res.writeHead(404);
            res.end()
        }
    } else {
        res.writeHead(405);
        res.end()
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
});
