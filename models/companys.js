'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Companys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Companys.hasMany(models.Branchs, {foreignKey:"idCompany"})
    }
  }
  Companys.init({
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    website: DataTypes.STRING,
    timeWorlk: DataTypes.STRING,
    hotline: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Companys',
  });
  return Companys;
};