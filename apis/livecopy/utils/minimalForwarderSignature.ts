import { ENV } from '../../utils/constants';
import { minimalForwarderInstance } from './contractInstances';
const chainId = ENV.chainId;

const minimalForwarderAddress = ENV.minimalForwarderContractAddress;

//creating the TypedV4 data to be signed by Operator/admin to verify their identity to minimalForwarder
const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
];

//forwarder standard request interface
interface IforwarderRequest {
  from: string;
  to: string;
  value: number;
  gas: number;
  nonce: number | string;
  data: string;
}

function getMetaTxTypeData(verifyingContract: string | undefined) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: 'MinimalForwarder',
      version: '0.0.1',
      chainId,
      verifyingContract,
    },
    primaryType: 'ForwardRequest',
  };
}

async function buildRequest(
  publicKey: string,
  targetAddress: string,
  nonce: number,
  data: string,
  gas: number,
) {
  return {
    from: publicKey,
    to: targetAddress,
    value: 0,
    gas: gas ? gas : 1e6,
    nonce: nonce,
    data: data,
  };
}

async function buildTypedData(
  request: IforwarderRequest,
  chainId: string | undefined,
  forwarder: string | undefined,
) {
  const typeData = getMetaTxTypeData(forwarder);
  return { ...typeData, message: request };
}

//creating TypedV4 data to Sign
async function helperMFDataToSign(
  from: string,
  targetAddress: string,
  data: string,
  gas: number,
) {
  const nonce = await minimalForwarderInstance.methods.getNonce(from).call();
  let request = await buildRequest(from, targetAddress, nonce, data, gas);
  console.log();
  let toSign = await buildTypedData(request, chainId, minimalForwarderAddress);
  return { nonce, toSign };
}

export { helperMFDataToSign };
