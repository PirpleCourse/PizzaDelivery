/*
 * Utility file that hold methods to help the request handler module
 *
 */

// Dependencies
const url = require('url');

// Object that'll be exported
var utils = {};

// All the server logic for both the http and https server
utils.getRequestData = (req, payload) => {
  // Parse the url
  let parsedUrl = url.parse(req.url, true);
  let path = parsedUrl.pathname;
  return {
    trimmedPath: path.replace(/^\/+|\/+$/g, ''),
    queryStringObject: parsedUrl.query,
    method: req.method.toLowerCase(),
    headers: req.headers,
    payload
  }
};

module.exports = utils;