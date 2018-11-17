var querystring = require('querystring');
var https = require('https');

module.exports = (() => {
  var self = this;

  self.send = (to, title, message, callback) => {
    // Configure the request payload
    var payload = {
      'from': 'Excited User <mailgun@smtp.mailgun.org>',
      'to': to,
      'subject': title,
      'html': message
    };

    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.mailgun.net',
      'method' : 'POST',
      'path' : '/v3/sandboxdc488dadc367470483c96e5f06beb6af.mailgun.org/messages',
      'auth' : 'api:key-3087121373dce2bae4af74eae2470db4',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  };

  return self;
})()