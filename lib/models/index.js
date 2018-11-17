/*
 * This is the primary root of data store which exports
 * all existing models we provide in our application
 * and initializes the data collections based on the models we define.
 *
 **/

// Dependencies
const fs = require('fs');
const path = require('path');
const _data = require('./../data');

var models = {}

// The main data collections path
models.databaseDir = path.join(__dirname, '/../../.data');

addCollectionIfNotExists = (name) => {
  let collectionPath = path.join(models.databaseDir, name)
  !fs.existsSync(collectionPath) && fs.mkdirSync(collectionPath)
}

initializeData = (name, details) => {
  // @TODO. Add logging.
  _data.read(name, details.name, (err, data) => {
    if (err && !data) {
      _data.create(name, details.name, details.data, ()=>{});
    }
  })
}

!fs.existsSync(models.databaseDir) && fs.mkdirSync(models.databaseDir);
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js') {
    modelName = file.replace('.js', '')
    let model = require(`./${file}`);
    models[modelName] = model;
    model.collection === true ? addCollectionIfNotExists(modelName) : null;
    model.defaultData ? initializeData(modelName, model.defaultData) : null;
  }
});

module.exports = models