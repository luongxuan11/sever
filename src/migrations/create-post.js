"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      star: {
        type: Sequelize.STRING,
        defaultValue: "0",
      },
      labelCode: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      attributeId: {
        type: Sequelize.STRING,
      },
      categoriesCode: {
        type: Sequelize.STRING,
      },
      pricesCode: {
        type: Sequelize.STRING,
      },
      acreagesCode: {
        type: Sequelize.STRING,
      },
      provincesCode: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.STRING,
      },
      overviewId: {
        type: Sequelize.STRING,
      },
      imageId: {
        type: Sequelize.STRING,
      },
      pricesNumber: {
        type: Sequelize.FLOAT,
      },
      acreagesNumber: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Posts");
  },
};
