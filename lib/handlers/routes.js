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

  router.addRoute('api/user', 'post', (data, callback) => {
    var { payload } = data;
    var {name, email, password, address, firstName, lastName} = helpers.parseJsonToObject(payload);
    if (!name && firstName && lastName) {
      name = `${firstName} ${lastName}`;
    }
    user.add(name, email, address, password, (err) => {
      callback(200, {'message': 'Welcome onboard'});
    })
  });

  router.addRoute('api/user', 'put', (data, callback) => {
    var { payload } = data;
    var parsedPayload = helpers.parseJsonToObject(payload);
    // We shouldn't allow a password or email to be updated without confirming the old one first
    parsedPayload.password ? delete parsedPayload.password : null;

    if (!parsedPayload.name && parsedPayload.firstName && parsedPayload.lastName) {
      parsedPayload.name = `${parsedPayload.firstName} ${parsedPayload.lastName}`;
    }

    user.update(parsedPayload.email, parsedPayload, (err) => {
      if (!err) {
        callback(200, {'message': 'Welcome onboard'});
      } else {
        callback(400, {'Error': 'Could not update user information'})
      }
    })
  }, helpers.verifyToken);

  router.addRoute('api/user', 'delete', (data, callback) => {
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

  router.addRoute('api/user', 'get', (data, callback) => {
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

  router.addRoute('api/token', 'post', (data, callback) => {
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

  router.addRoute('api/token', 'get', (data, callback) => {
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

  router.addRoute('api/token', 'delete', (data, callback) => {
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

  router.addRoute('api/token', 'put', (data, callback) => {
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
  router.addRoute('api/menu', 'post', (data, callback) => {
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
  router.addRoute('api/menu', 'delete', (data, callback) => {
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
  router.addRoute('api/menu', 'put', (data, callback) => {
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
  router.addRoute('api/menu', 'get', (data, callback) => {
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
  router.addRoute('api/order', 'post', (data, callback) => {
    var payload = helpers.parseJsonToObject(data.payload);
    order.new(payload, (err, orderData) => {
      if (err) {
        callback(400, {"Error": "Failed to place order"});
      } else {
        callback(200, {"message": "Successfully placed order."});
      }
    })
  }, helpers.verifyToken);

  // Add Public route
  router.addRoute('public', 'get', (data, callback) => {
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(!err && data){

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          // Callback the data
          callback(200,data,contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  })

  /*
   * HTML Renderers
   */
  router.addRoute('', 'get', (data, callback) => {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Uptime Monitoring - Made Simple',
      'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
      'body.class' : 'index'
    };

    helpers.renderTemplate('index', templateData, callback)
  });

  router.addRoute('account/create', 'get', (data, callback) => {
    var templateData = {
      'head.title' : 'Create an Account',
      'head.description' : 'Signup is easy and only takes a few seconds.',
      'body.class' : 'accountCreate'
    };

    helpers.renderTemplate('accountCreate', templateData, callback);
  });

  router.addRoute('account/edit', 'get', (data, callback) => {
    var templateData = {
      'head.title' : 'Account Settings',
      'body.class' : 'accountEdit'
    };

    helpers.renderTemplate('accountEdit', templateData, callback);
  });

  router.addRoute('account/deleted', 'get', (data, callback) => {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Account Deleted',
      'head.description' : 'Your account has been deleted.',
      'body.class' : 'accountDeleted'
    };

    helpers.renderTemplate('accountDeleted', templateData, callback);
  });

  router.addRoute('session/create', 'get', (data, callback) => {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Login to your account.',
      'head.description' : 'Please enter your phone number and password to access your account.',
      'body.class' : 'sessionCreate'
    };

    helpers.renderTemplate('sessionCreate', templateData, callback);
  });

  router.addRoute('session/deleted', 'get', (data, callback) => {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your account.',
      'body.class' : 'sessionDeleted'
    };

    helpers.renderTemplate('sessionDeleted', templateData, callback);
  });

  router.addRoute('menu/all', 'get', (data, callback) => {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Dashboard',
      'body.class' : 'checksList'
    };

    helpers.renderTemplate('menuList', templateData, callback);
  });

  router.addRoute('menu/create', 'get', (data, callback) => {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Create a New Item',
      'body.class' : 'checksCreate'
    };

    helpers.renderTemplate('menuCreate', templateData, callback);
  });

  router.addRoute('menu/checkout', 'get', (data, callback) => {
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Check Out',
      'body.class' : 'checkOut'
    };

    helpers.renderTemplate('checkOut', templateData, callback);
  });


  router.addRoute('favicon.ico', 'get', (data, callback) => {
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico',function(err,data){
      if(!err && data){
        // Callback the data
        callback(200,data,'favicon');
      } else {
        callback(500);
      }
    });
  })

  /*
   * Default Route API.
   */
  router.defaultRoute(function(data, callback) {
   	 callback(404, {'Error': 'This Path does not exist'});
  }, helpers.verifyToken);

 };