// Dependencies ---
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Setup server ---
const app = express()

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Listen on port 80
app.listen(80, () => console.log('Server started on port 80'))

// ------------------------------------------------
// Example 1
// this example is about making an SSE that reads '/text.txt' file and sends its value whenever it's changed.
// routes:
//  "/" will display the SSE data
//  "/liveStream" will send the SSE

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Live Text File Updates</title>
            </head>
            <body>
                <ul></ul>
                <div id="live-updates"></div>
                <script>
                    // const eventList = document.querySelector('ul');
                    
                    const source = new EventSource('/liveStream');
                    const updates = document.getElementById('live-updates');

                    source.onmessage = (e) => {
                        console.log(e)
                        updates.innerHTML = JSON.parse(e.data).data;
                        
                        // const newElement = document.createElement("li");
                        // newElement.textContent = \`message: \${e.data}\`;
                        // eventList.appendChild(newElement);
                        
                    }
                </script>
            </body>
        </html>
    `);
})

// the live stream - Server-Sent Events (SSE)
app.get('/liveStream', (req, res) => {
    // Set the response header to indicate SSE
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // Read the updated file
    read(); // Read the first time.
    function read() {
        fs.readFile('./text.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                // Send the updated text to the client
                res.write(`data: ${JSON.stringify({ data })}\n\n`);
            }
        });
    };

    // Keep the connection alive and watch for changes to the text file
    const watcher = fs.watchFile('./text.txt', { interval: 100 }, (curr, prev) => {
        // If the file has been modified
        if (curr.mtime !== prev.mtime) {
            // Read the updated file
            read();
        }
    });

    // Close the stream and stop watching the file when the client disconnects
    req.on('close', () => {
        watcher.stop();
        res.end();
    });
})

// ------------------------------------------------
// Example 2
// https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app

let clients = [];
let facts = [];

app.get('/events', (req, res, next) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const data = `data: ${JSON.stringify(facts)}\n\n`;

    res.write(data);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        res
    };

    clients.push(newClient);

    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

app.post('/fact', addFact);

async function addFact(request, respsonse, next) {
    const newFact = request.body;
    facts.push(newFact);
    respsonse.json(newFact)
    return sendEventsToAll(newFact);
};

function sendEventsToAll(newFact) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
};
