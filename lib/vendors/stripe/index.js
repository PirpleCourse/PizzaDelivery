/*
 * This is the initialization of Stripe API test payment method
 * The implementation is simple to only allow test development purposes perform
 * a payment on a Visa.
 */

var querystring = require('querystring');
var https = require('https');

module.exports = (() => {
  var self = this;


  /*
   * Given the amount, this is the core method
   * which will do all the logic to send a request to Stripe
   * and make a payment.
   *
   * @param amount integer: The amount to charge on the card.
   * @param callback function: A method callback having the result of the performed payment transaction
   */
  self.pay = (amount, callback) => {

    var payload = {
      amount,
      currency: 'usd',
      description: 'Test Charge',
      source: 'tok_visa'
    }

    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.stripe.com',
      'method' : 'POST',
      'path' : '/v1/charges',
      'auth' : 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
      'headers': {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();


  }
  return self;
})()


