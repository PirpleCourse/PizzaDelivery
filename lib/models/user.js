/*
 * User Model
 **/

// Dependencies
var _data = require('./../data');
var helpers = require('./../helpers');
const USER_DIR = 'user';

class User {
  static add(name, email, address, password, callback) {
    password = helpers.hash(password);
    _data.create(USER_DIR, email, {name, email, password, address}, callback)
  }

  static find(email, callback) {
    _data.read(USER_DIR, email, callback)
  }

  static delete(email, callback) {
    _data.delete(USER_DIR, email, callback)

  }

  static update(email, info, callback) {
    this.find(email, (err, data) => {
      data = {...data, ...info}
      _data.update(USER_DIR, email, data, callback)
    })
  }
}

User.collection = true;

module.exports = User;