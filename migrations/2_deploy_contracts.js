var Tixx = artifacts.require("./Tixx.sol");
var Venue = artifacts.require("./Venue.sol");

module.exports = function(deployer) {
  deployer.deploy(Tixx);
  deployer.deploy(Venue);
};
