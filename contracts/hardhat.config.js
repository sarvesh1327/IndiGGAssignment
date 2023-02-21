require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
const {config} = require('./config');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: config.NETWORK_RPC_URL,
      accounts: [
        config.ADMIN_PRIVATE_KEY,
      ],
    },
  },
  etherscan: {
    apiKey: config.POLYGON_SCAN_API_KEY,
  },
};