/*
 * Order Model
 */

// Dependencies
var _data = require('./../data');
var helpers = require('./../helpers');
var { stripe, mailgun } = require('./../vendors')
const ORDER_DIR = 'order';


class Order {
  static new(orderInfo, callback) {
    var menu = require('./menu');
    var user = require('./user');
    let id = helpers.createRandomString(20);
    let orderDetails = {};
    orderDetails.dateAdded = Date.now();

    // Find the name of the user placing the order from users
    user.find(orderInfo.email, (err, data) => {

      // Get the basic order details information
      orderDetails.name = data.name;
      orderDetails.address = data.address;

      // Find the details of the given item ids
      menu.findItems(orderInfo.items, (details) => {

        // Given all the item details in an array. Let's set those items.
        orderDetails.items = details;
        orderDetails.total = helpers.arrSum(details.map(({price}) => price));

        /*
         * Start the order template message build
         */

        // Build the email template message
        var introduction = '<h1>Thank you for placing an order! Payment was successful</h1>\n\n';
        var itemsString = '<h4>Items ordered</h4>\n<ul>';
        orderDetails.items.forEach((item, index, col) => {
          itemsString+= `<li><b>Name:</b> ${item.name}. <b>Price:</b> ${item.price}</li>\n`;
          if (index == col.length - 1) {
            itemsString+= '</ul>\n';
          }
        })
        var price = `\n\n<div>With a total price of: <b>$${orderDetails.total}</b></div>`
        var emailMessage = introduction + itemsString + price

        /*
         * End message template build
         */

        // Submit payment
        stripe.pay(orderDetails.total, (err) => {
          if (!err) {
            // Send email with confirmation
            mailgun.send(orderInfo.email, 'New order', emailMessage, (status) => {
              if (!err) {
                // Once submitted, add the order into our data collection
                _data.create(ORDER_DIR, id, orderDetails, callback);
              } else {
                callback(true);
              }
            })
          } else {
            callback(true);
          }
        });
      })
    });
  }

  static findAll(callback) {
    _data.list(ORDER_DIR, (err, orderIds) => {
      callback(orderIds);
    })
  }

  static find(orderId, callback) {
    _data.read(ORDER_DIR, orderId, callback)
  }
}

Order.collection = true;
module.exports = Order;