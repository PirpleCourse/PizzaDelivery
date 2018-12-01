module.exports = (() => {

  var handlers = require('./eventHandlers');
  
  var utils = {};

  utils.getAvailableInputs = () => {
    var inputs = [];
    for (var key in handlers) {
      inputs.push(key.split('_').join(' '));
    }
    return inputs;
  }

  utils.instantiateEmitters = (uniqueInputs, _event) => {
    uniqueInputs.forEach((input) => {
      let associated_responder = input.split(' ').join('_');
      if (handlers[associated_responder]) {
        _event.on(input, handlers[associated_responder])
      } else {
        console.log('Input event added but has no responder: ', input);
      }
    });
  }

  // Create a vertical space
  utils.verticalSpace = function(lines){
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('');
    }
  };

  // Create a horizontal line across the screen
  utils.horizontalLine = function(){

    // Get the available screen size
    var width = process.stdout.columns;

    // Put in enough dashes to go across the screen
    var line = '';
    for (i = 0; i < width; i++) {
        line+='-';
    }
    console.log(line);


  };

  // Create centered text on the screen
  utils.centered = function(str){
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

    // Get the available screen size
    var width = process.stdout.columns;

    // Calculate the left padding there should be
    var leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    var line = '';
    for (i = 0; i < leftPadding; i++) {
        line+=' ';
    }
    line+= str;
    console.log(line);
  };


  return utils;
})()