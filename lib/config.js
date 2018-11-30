module.exports = (function() {
  // Object that have our environments
  var envs = {};

  // Create the environments needed for our project
  envCreator(envs, 'staging', 3000, 3001, {
    'appName' : 'UptimeChecker',
    'companyName' : 'NotARealCompany, Inc.',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:3000/'
  });

  envCreator(envs, 'production', 5000, 5001, {
    'appName' : 'UptimeChecker',
    'companyName' : 'NotARealCompany, Inc.',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:5000/'
  });

  // Return the Chosen environment amongst the current environments
  return chosenEnv(envs);


  ////////////////////
  ///Private Functions
  ////////////////////

  /**
   * An Impure function to help create an environment
   * @param object: The current env object to expand on
   * @param name: String: name of the environment, stage, prod. etc.
   *            NOTE: the name of the env is also mapped as an `envName` key.
   * @param httpPort: Number: any number the HTTP server will listen to.
   * @param httpsPort: Number: any number the HTTPS server will listen to.
   * @return Object: A wrapped up environment by given option arguments
   */
  function envCreator(object, name, httpPort, httpsPort, templateGlobals) {
    return object[name] = {httpPort, httpsPort, envName: name, hashingSecret: name, templateGlobals}
  }

  /**
   * A pure function that determines which
   * environment will be used for the application
   *  NOTE: The Chosen environment will always default to Staging
   * @return Object: The chosen environment from the `envs` object
   */
  function chosenEnv(environments) {
    var defaultEnv = 'staging';
    var osEnv = process.env.NODE_ENV;
    currentEnv = typeof(osEnv) === 'string' ? osEnv.toLowerCase() : '';
    return typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments[defaultEnv];
  }
})()