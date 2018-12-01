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
    var dateAdded = Date.now();
    _data.create(USER_DIR, email, {name, email, password, address, dateAdded}, callback)
  }

  static find(email, callback) {
    _data.read(USER_DIR, email, callback)
  }

  static delete(email, callback) {
    _data.delete(USER_DIR, email, callback)

  }

  static findAll(callback) {
    var allUserDetails = [];
    _data.list(USER_DIR, (err, users) => {
      if (!err && users && users.length > 0) {
        users.forEach((_user, index, coll) => {
          this.find(_user, (err, userDetails) => {
            if (!err && userDetails) {
              allUserDetails.push(userDetails);
            }

            if (coll.length == (index +1)) {
              callback(allUserDetails);
            }
          });
        });
      } else {
        console.log('Error getting users');
      }
    })
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