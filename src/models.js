const Sequelize = require('sequelize');

const models = {}

const schemas = {
  history: {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    side: {type: Sequelize.STRING},
    action: {type: Sequelize.STRING},
    price: {type: Sequelize.FLOAT},
    type: {type: Sequelize.STRING}
  }
}

module.exports = function getModel(name, sequelize) {
  if (!models[name]) {
    models[name] = sequelize.define(name, schemas[name]);
    models[name].sync({force: true});
  }
  return models[name];
}
