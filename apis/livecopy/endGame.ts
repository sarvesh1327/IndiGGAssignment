import {
  minimalForwarderInstance,
  gameContractInstance,
} from './utils/contractInstances';
import signTypedData from './utils/signData';
import { helperMFDataToSign } from './utils/minimalForwarderSignature';
import { ENV } from '../utils/constants';
const gameContractAddress = ENV.gameContractAddress;

//it ends the game on Blockchain once the tournament expires
async function endGame(gameId: number) {
  try {
    let account = ENV.ADMIN_PUBLIC_KEY;
    console.log(`Ending the game ${gameId}`);
    //encoding the endGame method of gameContract to be forwarder through minimalForwarder
    const encodedAbi = gameContractInstance.methods.endGame(gameId).encodeABI();
    const { nonce, toSign } = await helperMFDataToSign(
      account,
      gameContractAddress,
      encodedAbi,
      1e7,
    );
    //signing TypedV4 data
    const signature = await signTypedData(ENV.ADMIN_PRIVATE_KEY, toSign);
    const request = {
      from: account,
      to: gameContractAddress,
      value: 0,
      gas: 1e7,
      nonce,
      data: encodedAbi,
    };
    //verifying the signature
    const valid = await minimalForwarderInstance.methods
      .verify(request, signature)
      .call();
    console.log('signature is valid?', valid);
    if (valid) {
      //initiating the endGame transaction
      const result = await minimalForwarderInstance.methods
        .execute(request, signature)
        .send();
      console.log(
        `Transaction for end game completed with Transaction Hash ${result.transactionHash}`,
      );
    } else {
      throw new Error('Invalid Signature');
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

export { endGame };
