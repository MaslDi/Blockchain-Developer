var SampleToken = artifacts.require("SampleToken");

module.exports = function(deployer) {
  deployer.deploy(SampleToken, "Marcel", "MASL", 3, 1000000);
};
