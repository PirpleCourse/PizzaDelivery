var os = require('os');
var v8 = require('v8');
var models = require('./../models');

var handlers = {};

handlers.man = (input, help) => {
  var utils = require('./utils');
  if (help) {
    // Show a header for the help page that is as wide as the screen
    utils.horizontalLine();
    utils.centered('CLI MANUAL');
    utils.horizontalLine();
    utils.verticalSpace(2);
    return 'Show this help page'
  }

  for (var key in handlers) {
    var inputAllowed = key.split('_').join(' ');
    var value = handlers[key](undefined, true)
    var line = '      \x1b[33m '+inputAllowed+'      \x1b[0m';
    var padding = 60 - line.length;
    for (i = 0; i < padding; i++) {
        line+=' ';
    }
    line+=value;
    console.log(line);
    utils.verticalSpace()
  }
}

handlers.help = (input, help) => {
  var utils = require('./utils');
  if (help) {
    // Show a header for the help page that is as wide as the screen
    return 'Alias of the "man" command'
  }

  for (var key in handlers) {
    var inputAllowed = key.split('_').join(' ');
    var value = handlers[key](undefined, true)
    var line = '      \x1b[33m '+inputAllowed+'      \x1b[0m';
    var padding = 60 - line.length;
    for (i = 0; i < padding; i++) {
        line+=' ';
    }
    line+=value;
    console.log(line);
    utils.verticalSpace()
  }
}

handlers.stats = (input, help) => {
  var utils = require('./utils');
  if (help) {
    return ''
  }
  // Compile an object of stats
  var stats = {
    'Load Average' : os.loadavg().join(' '),
    'CPU Count' : os.cpus().length,
    'Free Memory' : os.freemem(),
    'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime' : os.uptime()+' Seconds'
  };

  // Create a header for the stats
  utils.horizontalLine();
  utils.centered('SYSTEM STATISTICS');
  utils.horizontalLine();
  utils.verticalSpace(2);

  // Log out each stat
  for(var key in stats){
     if(stats.hasOwnProperty(key)){
        var value = stats[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        utils.verticalSpace();
     }
  }

  // Create a footer for the stats
  utils.verticalSpace();
  utils.horizontalLine();
}

handlers.exit = (input, help) => {
  if (help) {
   return 'Kill the CLI (and the rest of the application)'
  }

  console.log('\nShutting off.')
  process.exit(0);
}

handlers.list_orders = (input, help) => {
  var utils = require('./utils');
  if (help) {
   return 'Lists the orders placed within the last 24 hours'
  }
  var Order = models.order;
  var ts = Math.round(new Date().getTime() / 1000);
  var tsYesterday = ts - (24 * 3600);
  Order.findAll((orderIds) => {
    if (orderIds && orderIds.length > 0) {
      orderIds.forEach((orderId, index) => {
        Order.find(orderId, (err, orderDetails) => {
          if (!err && orderDetails) {
            if (orderDetails.dateAdded > tsYesterday) {
              console.log(`${index + 1}. Order ID: ${orderId}. Price: $${orderDetails.total}`)
              utils.verticalSpace();
            }
          }
        })
      })
    }
  });
}

handlers.more_order_info = (str, help) => {
  var utils = require('./utils');
  if (help) {
   return 'Gets order details. What was ordered and the price by giving an order id as --{orderId}'
  }
  var Order = models.order;
  // Get ID from string
  var arr = str.split('--');
  var orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(orderId){
    Order.find(orderId, (err, orderDetails) => {
      // Print their JSON object with text highlighting
      utils.verticalSpace();
      console.dir(orderDetails,{'colors' : true});
      utils.verticalSpace();
    })
  }
}

handlers.list_menu = (input, help) => {
  var utils = require('./utils');
  if (help) {
   return 'This is just a help command'
  }
  var Menu = models.menu;

  Menu.findAll((menu) => {
    menu.items.forEach((item, idx) => {
      console.log(`${idx + 1}. Name: ${item.name}. Price: $${item.price}`)
      utils.verticalSpace();
    })
  })
}

handlers.list_new_users = (input, help) => {
  var utils = require('./utils');
  if (help) {
   return 'Show a list of ONLY the users registered in the past 24 hours'
  }
  var User = models.user;
  var ts = Math.round(new Date().getTime() / 1000);
  var tsYesterday = ts - (24 * 3600);
  User.findAll((users) => {
    users.forEach((_userData, index) => {
      if (_userData.dateAdded > tsYesterday) {
        console.log(`${index + 1}. Name: ${_userData.name}, Email: ${_userData.email}`)
        utils.verticalSpace();
      }
    })
  })
}

handlers.list_users = (input, help) => {
  var utils = require('./utils');
  if (help) {
   return 'Show a list of all the registered (undeleted) users in the system'
  }
  var User = models.user;
  User.findAll((users) => {
    users.forEach((_userData, index) => {
      console.log(`${index + 1}. Name: ${_userData.name}, Email: ${_userData.email}`)
      utils.verticalSpace();
    })
  })
}

handlers.more_user_info = (str, help) => {
  var utils = require('./utils');
  if (help) {
   return 'Show details of a specified user'
  }
  // Get ID from string
  var arr = str.split('--');
  var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(userId){
    var User = models.user;
    // Lookup the user
    User.find(userId,function(err,userData){
      if(!err && userData){
        // Remove the hashed password
        delete userData.password;

        // Print their JSON object with text highlighting
        utils.verticalSpace();
        console.dir(userData,{'colors' : true});
        utils.verticalSpace();
      }
    });
  }
}

module.exports = handlers;