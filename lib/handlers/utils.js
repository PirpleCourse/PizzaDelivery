var { StringDecoder } = require('string_decoder');
var url = require('url');

var utils = {};
// Method to get the data payload
utils.handleRequests = (req, res, details) => {
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[details.trimmedPath]) !== 'undefined' ? router[details.trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        'trimmedPath' : details.trimmedPath,
        'queryStringObject' : details.queryStringObject,
        'method' : details.method,
        'headers' : details.headers,
        'payload' : buffer
      };

      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload){

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);
      });
  });

}

// All the server logic for both the http and https server
utils.requestListener = (req,res) => {
  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  var requestDetails = {
    parsedUrl, path, trimmedPath, queryStringObject, method, headers
  }

  utils.handleRequests(req, res, requestDetails);
};

var handlers = {}

handlers.hello = function(data, callback) {
  callback(200, {'message': 'Welcome onboard'});
}

// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

var router = {
  'hello': handlers.hello
}

module.exports = utils;
