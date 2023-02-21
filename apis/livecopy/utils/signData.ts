import { signTypedMessage } from 'eth-sig-util';

//function for signing TypedV4 data
async function signTypedData(privateKey: string | undefined, data: any) {
  // If signer is a private key, use it to sign
  const _privateKey = Buffer.from(privateKey.replace(/^0x/, ''), 'hex');
  return signTypedMessage(_privateKey, { data });
}

export default signTypedData;
