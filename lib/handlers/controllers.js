/*
 * The primary of all RESTFUL Methods and their associated functions
 */

module.exports = (router) => {

  router.addRoute('hello', 'get', (data, callback) => {
   	callback(200, {'message': 'Welcome onboard'});
  });

  router.defaultRoute(function(data, callback) {
   	 callback(404, {'Error': 'API does not exist'});
  });

 }