/*
 * Token Model
 **/

// Dependencies
var _data = require('./../data');
var helpers = require('./../helpers');
const TOKEN_DIR = 'token';

class Token {
  static store(id, object, callback) {
    _data.create(TOKEN_DIR, id, object, callback);
  }

  static find(id, callback) {
    _data.read(TOKEN_DIR, id, callback)
  }

  static delete(id, callback) {
    _data.delete(TOKEN_DIR, id, callback)
  }

  static update(id, object, callback) {
    _data.update(TOKEN_DIR, id, object, callback)
  }
}

Token.collection = true;
module.exports = Token;