"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .createTable('Tickets', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        userEmail: Sequelize.STRING,
        userEthAddress: Sequelize.STRING,
        event: Sequelize.STRING,
        row: Sequelize.INTEGER,
        column: Sequelize.INTEGER,
        resale: Sequelize.BOOLEAN,
        origPrice: Sequelize.INTEGER,
        newPrice: Sequelize.INTEGER,
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: Sequelize.DATE
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface
      .dropTable('Tickets');
  }
};
