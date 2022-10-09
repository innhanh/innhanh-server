'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Categorys, { foreignKey: "idCate" });
      this.hasMany(models.Texts, { foreignKey: "idPages" });
      this.belongsTo(models.Links, { foreignKey: "idLink" });
    }
  }
  Pages.init({
    name: DataTypes.STRING,
    idCate: DataTypes.INTEGER,
    idLink: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pages',
  });
  return Pages;
};