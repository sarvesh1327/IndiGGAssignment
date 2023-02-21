import { ENV } from '../../utils/constants';
import { web3Instance, relayerAddress } from './relayerProvider';
import minimalForwarderAbi from '../abis/MinimalForwarder_ABI.json';
import gameContractAbi from '../abis/GameContract_ABI.json';
const minimalForwarderAddress = ENV.minimalForwarderContractAddress;
const gameContractAddress = ENV.gameContractAddress;

//minimalForwarder instance with web3
const minimalForwarderInstance = new web3Instance.eth.Contract(
  minimalForwarderAbi,
  minimalForwarderAddress,
  { from: relayerAddress },
);

//gameContract instance with web3
const gameContractInstance = new web3Instance.eth.Contract(
  gameContractAbi,
  gameContractAddress,
  { from: relayerAddress },
);

export { minimalForwarderInstance, gameContractInstance };
