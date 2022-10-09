'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Links extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Carousels, { foreignKey: "idLink" });
      this.hasOne(models.Categorys, { foreignKey: "idLink" });
      this.hasOne(models.Pages, { foreignKey: "idLink" });
    }
  }
  Links.init({
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Links',
  });
  return Links;
};