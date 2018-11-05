// Dependencies
var config = require('./config');
var http = require('http');
var url = require('url');
var handlers = require('./handlers');
var data = require('./data');

// Declare the exported server
var server = {};

// Instantiate HTTP servers
server.httpServer = http.createServer(handlers.handleRequests);

// Start the HTTP server
server.init = () => {
  server.httpServer.listen(config.httpPort, () => {
    console.log(`\x1b[37mThe HTTP server is running on port ${config.httpPort}`);
  });

  // Initialize the database and create the collections we need in root directory .data
  data.init();
}

// Export server
module.exports = server;