require("dotenv").config();

const config = {
  RELAYER_ADDRESS: process.env.RELAYER_ADDRESS,
  NETWORK_RPC_URL: process.env.NETWORK_RPC_URL,
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
  POLYGON_SCAN_API_KEY: process.env.POLYGON_SCAN_API_KEY,
};

module.exports = {
  config,
};
