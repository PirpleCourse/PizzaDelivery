/*
 * @TODO Purpose of file
 **/

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const { routeRequest } = require('./router');

//Object to export
var handlers = {};

// Method to get the data payload
handlers.handleRequests = (req, res) => {

  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data) {
      buffer += decoder.write(data);
  });

  req.on('end', function() {
      buffer += decoder.end();
      routeRequest(req, res, buffer);
  });

}

// Export handler;
module.exports = handlers;