const { program } = require('commander');
const http = require('http');
const fs = require('fs');
const path = require('path');
const superagent = require('superagent');

//CMD PARSER ---
program.requiredOption('-h, --host <host>')
program.requiredOption('-p, --port <port>')
program.requiredOption('-c, --cache <cache>');
program.parse();
const options = program.opts();

const host = options.host;
const port = options.port;
const cache = options.cache;

//SERVER ---
async function requestListener(req, res) {

    const imgIndex = req.url.slice(1);
    const imgPath = path.join(cache, `${imgIndex}.jpg`);

    if (req.method === 'GET') {
        try{
            const data = await fs.promises.readFile(imgPath);
            res.writeHead(200,{ 'Content-Type': 'image/jpeg' });
            res.end(data);
        }catch{

            try{
                const response = await superagent.get(`https://http.cat/${imgIndex}`)
                await fs.promises.mkdir(path.dirname(imgPath), { recursive: true });
                await fs.promises.writeFile(imgPath, response.body);
                res.writeHead(200,{'Content-Type':'image/jpeg'})
                res.end(response.body);
            }catch{
                res.writeHead(404);
                res.end(`<!DOCTYPE html><html><style>body{display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:'Arial',sans-serif;background-color:#f4f4f4;color:#333;text-align:center;}h1{font-size:48px;color:#ff6347;}</style></head><body><h1>NO CATS FOR YOU\n(404)</h1></body></html>`);

            }
            
        }

    } else if (req.method === 'PUT') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', async () => {
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
    console.log(`Server is running at http://${host}:${port}/`);
});
