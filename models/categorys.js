'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here    
      this.hasMany(models.Pages, { foreignKey: "idCate" });

      this.belongsTo(models.Links, { foreignKey: "idLink" });
    }
  }
  Categorys.init({
    name: DataTypes.STRING,
    idLink: DataTypes.INTEGER
  }, {
    sequelize,
    
    modelName: 'Categorys',
  });
  return Categorys;
};