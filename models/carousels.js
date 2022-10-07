'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carousels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Images, { foreignKey: "idImage" });
      this.belongsTo(models.Links, { foreignKey: "idLink" });
    }
  }
  Carousels.init({
    idImage: DataTypes.INTEGER,
    idLink: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Carousels',
  });
  return Carousels;
};