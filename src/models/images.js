"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.hasOne(models.Post, { foreignKey: "imageId", as: "images" }); // foreignKey là khóa ngoại được được liên kết qua khóa chính là id
    }
  }
  Image.init(
    {
      image: DataTypes.TEXT,
      fileName: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
