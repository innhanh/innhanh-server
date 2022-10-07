'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branchs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Branchs.belongsTo(models.Companys, {foreignKey:"idCompany"})
    }
  }
  Branchs.init({
    name: DataTypes.STRING,
    adress: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    zalo: DataTypes.STRING,
    idCompany: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Branchs',
  });
  return Branchs;
};