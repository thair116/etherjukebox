var Jukebox = artifacts.require("./Jukebox.sol");

module.exports = function(deployer) {
  deployer.deploy(Jukebox);
};
