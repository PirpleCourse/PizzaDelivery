/*
 * This is a service of the handler module
 * Requests come in by the server and needs to be routed to the correct controller
 * this router service reads in defined routes from the controllers file and executes
 * based on the reques methods. Router also handles ONE middleware function to be executed
 * prior getting to the controller function. i.e: A middleware could help verify tokens.
 *
 */

// Dependencies
const { getRequestData } = require('./utils');

// Initialize router object
var router = {} 


/*
 * This is the main router of this service.
 * It accepts the arguments from the server and routes/executes by controllers
 *
 * @param req object. server request.
 * @param res object. server response.
 * @param payload string. This is the buffer string transmitted by the request event
 *
 **/
router.routeRequest = (req, res, payload) => {

  // Construct the data object to send to the handler
  let data = getRequestData(req, payload);

  // Route the request to the right controller
  let {controller, middleware} = router.getRouteControllerAndMiddleWare(data);
  
  if (middleware) {
    middleware(res, data, next = () => {
      router.requestControllerExecutor(req, res, data, controller);
    });
  } else {
    router.requestControllerExecutor(req, res, data, controller);
  }
}

router.routeContainer = {}; // The container which holds all necessary data to this route
router.routeContainer.routes = {}; // Subcontainer having all the API routes information

/*
 * This method dumps a route to our route container
 * Which could then be referenced when execution time happens for the application
 *
 * @param route string: The route of the new API
 * @param method string: method name of the API ..'get', 'post' ...
 * @param controller function: This is the function that'll get called when an API is sent toward it
 * @param middleware function: This is a function to be called only if exists. 
 */
router.addRoute = (route, method, controller, middleware) => {
  let { routes } = router.routeContainer;
  routes[router.readableRoutePath(method, route)] = {
    controller, middleware
  }
}

/*
 * The default function that'll be defined by the 
 * author of the application which would be used in case
 * the request that comes in does not find a route to go for.
 *
 * @param method function: default function
 */
router.defaultRoute = (method) => {
  router.routeContainer.routes.default = method;
}

/*
 * A pure function that helps with returning
 * digested route conventions that we use in our applicaiton
 *
 * @param method string: the method name
 * @param route string: the route name
 */
router.readableRoutePath = (method, route) => {
 return `${method}_${route}`
}

/*
 * This is the API executor, the API request ends here
 *
 * @param req object. server request.
 * @param res object. server response.
 * @param data object: The request data with cleaned keys.
 * @param controller function: This is the function that'll get called when an API is sent toward it
 */
router.requestControllerExecutor = (req, res, data, controller) => {
  controller(data, (statusCode, payload) => {
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
  })
}

/*
 * Packs the controller and middleware methods to be used
 * which are dumped in the routes key. Default is being used if a route wasn't found
 *
 * @param data object: The data object having all the cleaned request keys/paths will be used to find
 *  a route. DEFAULT to `router.routerContainer.routes..default`
 */
router.getRouteControllerAndMiddleWare = (data) => {
  let { routes } = router.routeContainer;
  let routePath = router.readableRoutePath(data.method, data.trimmedPath);
  return typeof(routes[routePath]) !== 'undefined' ? routes[routePath] : {controller: routes.default};
}

// Here we import the routes from the router container controller service. If there are any defined
// routes there it should be pulled in into our router service.
require('./controllers')(router);


// Export router
module.exports = router;