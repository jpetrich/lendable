// This is the hardhat config file for CI only. 
// used by .github/workflows/lendable-ci.yml 
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle4");
require("@nomiclabs/hardhat-ethers");

module.exports = {
	solidity: {
		version: "0.8.0",
		settings: {
	  		outputSelection: {
				"*": {
		  			"*": ["storageLayout"]
				}
	  		},
			optimizer: {
				enabled: true,
				runs: 200,
			}
		}
	},
};
