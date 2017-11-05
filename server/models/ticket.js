"use strict";

module.exports = function(sequelize, DataTypes) {
  var Ticket = sequelize.define("Ticket", {
    userEmail: DataTypes.STRING,
    userEthAddress: DataTypes.STRING,
    event: DataTypes.STRING,
    row: DataTypes.INTEGER,
    column: DataTypes.INTEGER,
    resale: DataTypes.BOOLEAN,
    origPrice: DataTypes.INTEGER,
    newPrice: DataTypes.INTEGER
  });

  return Ticket;
};

