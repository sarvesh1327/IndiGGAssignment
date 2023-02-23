interface Ienv {
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  TOTAL_PLAYERS: string;
  RELAYER_ADDRESS: string;
  RELAYER_API_KEY: string;
  RELAYER_SECRET_KEY: string;
  ADMIN_PUBLIC_KEY: string;
  ADMIN_PRIVATE_KEY: string;
  minimalForwarderContractAddress: string;
  gameContractAddress: string;
  chainId: string;
}

const ENV = <Ienv>{
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  TOTAL_PLAYERS: process.env.TOTAL_PLAYERS,
  RELAYER_ADDRESS: process.env.RELAYER_ADDRESS,
  RELAYER_API_KEY: process.env.RELAYER_API_KEY,
  RELAYER_SECRET_KEY: process.env.RELAYER_SECRET_KEY,
  ADMIN_PUBLIC_KEY: process.env.ADMIN_PUBLIC_KEY,
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
  minimalForwarderContractAddress: process.env.minimalForwarderContractAddress,
  gameContractAddress: process.env.gameContractAddress,
  chainId: process.env.chainId,
};

export { ENV };
