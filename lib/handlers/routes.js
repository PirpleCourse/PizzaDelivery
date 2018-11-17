/*
 * The primary of all RESTFUL Methods and their associated functions
 * @TODO: Set all independent API routes into their own files.
 *
 * @TODO: Refactor the current addRoute method to be like
 * An express app with the usage similar to
 * router.addRoute('<route>')
 *       .post()
 *       .get()
 *       .put()
 *       .delete()
 *       .middlewares([<Func1>,<Func2>])
 *
 * With that approach, we could easily setup new APIs with assigned middlewares
 */
var { user, token, menu, order } = require('./../models')
var helpers = require('./../helpers');

module.exports = (router) => {

  /*
   * User API Route Controller
   */

  router.addRoute('user', 'post', (data, callback) => {
    var { payload } = data;
    var {name, email, password, address} = helpers.parseJsonToObject(payload);
    user.add(name, email, address, password, (err) => {
      callback(200, {'message': 'Welcome onboard'});
    })
  });

  router.addRoute('user', 'put', (data, callback) => {
    var { payload } = data;
    var parsedPayload = helpers.parseJsonToObject(payload);
    // We shouldn't allow a password or email to be updated without confirming the old one first
    parsedPayload.password ? delete parsedPayload.password : null;
    user.update(parsedPayload.email, parsedPayload, (err) => {
      if (!err) {
        callback(200, {'message': 'Welcome onboard'});
      } else {
        callback(400, {'Error': 'Could not update user information'})
      }
    })
  }, helpers.verifyToken);

  router.addRoute('user', 'delete', (data, callback) => {
    var { payload } = data;
    var { email } = helpers.parseJsonToObject(payload);
    if (email) {
      user.delete(email, (err) => {
        if (!err) {
          callback(200, {'message': 'User Deleted'});
        } else {
          callback(400, {'Error': 'Could not delete user'});
        }
      });
    } else {
      callback(400, {'Error': 'Email missing.'});
    }
  }, helpers.verifyToken);

  router.addRoute('user', 'get', (data, callback) => {
    var { queryStringObject } = data;
    var email = queryStringObject.email;
    if (email) {
      user.find(email, (err, user) => {
        if (err) {
          callback(404, {'Error': 'User does not exist'});
        } else {
          callback(200, user);
        }
      });
    } else {
      callback(404, {'Error': 'Not valid email'});
    }
  }, helpers.verifyToken);

  /*
   * Token API Route Controller
   */

  router.addRoute('token', 'post', (data, callback) => {
    var { payload } = data;
    var { email, password } = helpers.parseJsonToObject(payload);
    if (email && password) {
      user.find(email, (err, user) => {
        if (!err && user) {
          hashedPassword = helpers.hash(password);
          if (hashedPassword === user.password) {
            var tokenId = helpers.createRandomString(20);
            var expires = Date.now() + 1000 * 60 * 60;
            var tokenObject = {
              'email' : email,
              'id' : tokenId,
              'expires' : expires
            };

            // Store the token
            token.store(tokenId, tokenObject, (err) => {
              if(!err){
                callback(200,tokenObject);
              } else {
                callback(500,{'Error' : 'Could not create the new token'});
              }
            });
          } else {
            callback(400,{'Error' : 'Password did not match the specified user\'s stored password'});
          }
        } else {
          callback(400,{'Error' : 'Could not find the specified user.'});
        }
      })
    } else {
      callback(400,{'Error' : 'Missing required field(s).'})
    }
  });

  router.addRoute('token', 'get', (data, callback) => {
    var { queryStringObject } = data;
    if (queryStringObject.id) {
      token.find(queryStringObject.id, (err, tokenData) => {
        if (!err && tokenData) {
          callback(200, tokenData);
        } else {
          callback(400, {'Error': 'Invalid Token ID'});
        }
      })
    } else {
      callback(404, {'Error': 'Missing Required fields. `id`'});
    }
  }, helpers.verifyToken);

  router.addRoute('token', 'delete', (data, callback) => {
    var { queryStringObject } = data;
    if (queryStringObject.id) {
      token.delete(queryStringObject.id, (err, tokenData) => {
        if (!err && tokenData) {
          callback(200, tokenData);
        } else {
          callback(400, {'Error': 'Invalid Token ID'});
        }
      })
    } else {
      callback(404, {'Error': 'Missing Required fields. `id`'});
    }
  }, helpers.verifyToken);

  router.addRoute('token', 'put', (data, callback) => {
    var {id, extend} = helpers.parseJsonToObject(data.payload);
    if (id && extend) {
      token.find(id, (err, tokenData) => {
        if (!err && tokenData) {
          if (tokenData.expires > Date.now()) {
            tokenData.expires = Date.now() + 1000 * 60 * 60;
            token.update(id, tokenData, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500,{'Error' : 'Could not update the token\'s expiration.'});
              }
            })
          } else {
            callback(400,{"Error" : "The token has already expired, and cannot be extended."});
          }
        } else {
          callback(400,{'Error' : 'Specified user does not exist.'});
        }
      })
    } else {
      callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
    }
  });

  /**
   * Menu API Route
   */

  // Add a new item to the menu list
  router.addRoute('menu', 'post', (data, callback) => {
    var { name, price } = helpers.parseJsonToObject(data.payload);
    menu.add(name, price, (err, tokenData) => {
      if (err) {
        callback(400, {"Error": "Failed to add an item"});
      } else {
        callback(200, {"message": "Successfully added new item"});
      }
    })
  }, helpers.verifyToken);

  // Delete an item from the menu list
  router.addRoute('menu', 'delete', (data, callback) => {
    var { id } = data.queryStringObject;
    if (id) {
      menu.delete(id, (err) => {
        if (!err) {
          callback(200, {"message": "Successfully deleted item"})
        } else {
          callback(400, {"Error": `Error deleting item id: ${id}`})
        }
      })
    } else {
      callback(400, {"Error": "Missing item `id`"})
    }
  }, helpers.verifyToken);

  // Update an item name from the menu list
  router.addRoute('menu', 'put', (data, callback) => {
    var { id, name, price, email } = helpers.parseJsonToObject(data.payload);
    if (id && (name || price)) {
      let info = {name, price}
      menu.update(id, info, (err) => {
        if (!err) {
          callback(200, {"message": "Successfully updated item"})
        } else {
          callback(400, {"Error": `Error updating item id: ${id}`})
        }
      })
    } else {
      callback(400, {"Error": "Missing required params"});
    }
  }, helpers.verifyToken);

  // Get all items from the menu list
  router.addRoute('menu', 'get', (data, callback) => {
    menu.findAll((menu) => {
      if (menu) {
        callback(200, menu)
      } else {
        callback(400, {"Error": "Failed to fetch menu"})
      }
    })
  }, router.verifyToken);


  /**
   * Orders API routes controllers
   */

  // Places a new order and emails the user with tht order placed
  router.addRoute('order', 'post', (data, callback) => {
    var payload = helpers.parseJsonToObject(data.payload);
    order.new(payload, (err, orderData) => {
      if (err) {
        callback(400, {"Error": "Failed to place order"});
      } else {
        callback(200, {"message": "Successfully placed order."});
      }
    })
  }, helpers.verifyToken);


  // Default to 404 if path doesn't exist
  router.defaultRoute(function(data, callback) {
   	 callback(404, {'Error': 'This Path does not exist'});
  }, helpers.verifyToken);

 };