/*
 * Starting the Pizza Delivery app from `index.js`
 */

var server = require('./lib/server');
var cli = require('./lib/cli');

server.init().then(cli.init);