const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const port = 8080;

const { ftp } = require('./routes/ftp');

app.use(ftp);

// Start server
function startServer() {
  server.listen(port, () => {
    console.info('Express server listening on http://localhost:8080/ftp');
  });
}

setImmediate(startServer);
