'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Maintenances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Maintenances.init({
    on: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Maintenances',
  });
  return Maintenances;
};