'use strict';
import Web3 from 'web3';
import { ENV } from '../../utils/constants';

import { DefenderRelayProvider } from 'defender-relay-client/lib/web3';

let web3Instance: any = null;
const relayerAddress = ENV.RELAYER_ADDRESS;
// creating the web3 instance with defender relayer client as the provider for metatxs
try {
  const credentials = {
    apiKey: ENV.RELAYER_API_KEY,
    apiSecret: ENV.RELAYER_SECRET_KEY,
  };
  const provider = new DefenderRelayProvider(credentials, { speed: 'fast' });
  web3Instance = new Web3(provider);
} catch (err) {
  console.error(err);
}

export { web3Instance, relayerAddress };
