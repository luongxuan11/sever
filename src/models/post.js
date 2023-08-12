"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Post.belongsTo(models.Image, {
        // lấy tt bảng khác thông qua bảng post
        foreignKey: "imageId", // bảng cần lấy tt
        targetKey: "id", // liên kết qua khóa chính của id
        as: "images", // bí danh mỗi lần gọi lên sẽ thấy trường này ở đầu
      });

      Post.belongsTo(models.Attribute, {
        foreignKey: "attributeId",
        targetKey: "id",
        as: "attribute"
      })

      Post.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "user"
      })

      Post.belongsTo(models.Overview, {
        foreignKey: "overviewId",
        targetKey: "id",
        as: "overviews"
      })
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      star: DataTypes.STRING,
      labelCode: DataTypes.STRING,
      address: DataTypes.STRING,
      attributeId: DataTypes.STRING,
      categoriesCode: DataTypes.STRING,
      pricesCode: DataTypes.STRING,
      acreagesCode: DataTypes.STRING,
      provincesCode: DataTypes.STRING,
      description: DataTypes.TEXT,
      userId: DataTypes.STRING,
      overviewId: DataTypes.STRING,
      imageId: DataTypes.STRING,
      pricesNumber: DataTypes.FLOAT,
      acreagesNumber: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
