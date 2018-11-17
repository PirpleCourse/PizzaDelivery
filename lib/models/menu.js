/*
 * Menu Model
 **/

// Dependencies
var _data = require('./../data');
var helpers = require('./../helpers');
const MENU_DIR = 'menu';


class Menu {
  static add(name, price, callback) {
    let id = helpers.createRandomString(20);
    _data.read(MENU_DIR, 'items', (err, menu) => {
      let newItem = { id, name, price };
      menu.items.push(newItem);
      _data.update(MENU_DIR, 'items', menu, callback)
    })
  }

  static findAll(callback) {
    _data.read(MENU_DIR, 'items', (err, menu) => {
      callback(menu);
    })
  }

  static delete(_id, callback) {
    this.findAll((menu) => {
      let { items } = menu;
      let idx = null;
      items.forEach(({id}, index) => {
        if (id === _id) {
          idx = index;
          return;
        }
      });
      items.splice(idx, 1);
      _data.update(MENU_DIR, 'items', menu, callback)
    })
  }

  static update(_id, info, callback) {
    this.findAll((menu) => {
      let { items } = menu;
      let idx = null;
      items.forEach(({id}, index) => {
        if (id === _id) {
          idx = index;
          return;
        }
      });
      items[idx] = {
        ...items[idx], ...info
      }
      _data.update(MENU_DIR, 'items', menu, callback);
    })
  }

  static findItems(_items, callback) {
    this.findAll((menu) => {
      let { items } = menu;
      let filteredItems = items.filter(({id}) => _items.indexOf(id) > -1 );
      callback(filteredItems);
    })
  }
}

Menu.collection = true;


Menu.defaultData= {
  'name': 'items',
  'data': {
    'items': [{
    "id": "lelg7u3roluxtztl7b32",
    "name": "Bacon Cheddar Ham Pizza",
    "price": 34
    },
    {
      "id": "geotrjtyjek9348s0ugz",
      "name": "Taco Pizza",
      "price": 38
    },
    {
      "id": "q9elki85g0ha1diqourp",
      "name": "Everything Monster Pizza",
      "price": 37
    },
    {
      "id": "s18n29snq68ssdz1qpqx",
      "name": "Buffalo Chicken Pizza",
      "price": 31
    },
    {
      "id": "3817mcux6nkr8n6wrr7f",
      "name": "Chicken Fajita Pizza",
      "price": 13
    },
    {
      "id": "saklp98p5jt6b4y65hqu",
      "name": "Pepperoni Max Pizza",
      "price": 16
    },
    {
      "id": "xubyzzcl8nh8fzsblj37",
      "name": "Veggie Max Pizza",
      "price": 44
    }]
  }
}

module.exports = Menu;