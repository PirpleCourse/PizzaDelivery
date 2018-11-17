/*
 * Order Model
 **/

// Dependencies
var _data = require('./../data');
var helpers = require('./../helpers');
const ORDER_DIR = 'order';

class Order {
  static new(orderInfo, callback) {
    var menu = require('./menu');
    var user = require('./user');
    let id = helpers.createRandomString(20);
    let orderDetails = {}
    // Find the name of the user placing the order from users
    user.find(orderInfo.email, (err, data) => {
      orderDetails.name = data.name;
      orderDetails.address = data.address;
      menu.findItems(orderInfo.items, (details) => {
        orderDetails.items = details;
        orderDetails.total = helpers.arrSum(details.map(({price}) => price));
        _data.create(ORDER_DIR, id, orderDetails, callback);
      })
    });
  }

  static find(id, callback) {
    _data.read(ORDER_DIR, id, callback)
  }

  static delete(id, callback) {
    _data.delete(ORDER_DIR, id, callback)
  }

  static update(id, object, callback) {
    _data.update(ORDER_DIR, id, object, callback)
  }
}

Order.collection = true;
module.exports = Order;