import {
  minimalForwarderInstance,
  gameContractInstance,
} from './utils/contractInstances';
import signTypedData from './utils/signData';
import { helperMFDataToSign } from './utils/minimalForwarderSignature';
import { ENV } from '../utils/constants';
const gameContractAddress = ENV.gameContractAddress;

//enters the game for user in Blockchain
async function enterGame(gameId: number, player: string) {
  try {
    let account = ENV.ADMIN_PUBLIC_KEY;
    console.log(`Entering the game for player ${player} in gameId ${gameId}`);
    //encoding the enterGame method of gameContract to be forwarded through minimal Forwarder
    const encodedAbi = gameContractInstance.methods
      .enterGame(gameId, player)
      .encodeABI();

    const { nonce, toSign } = await helperMFDataToSign(
      account,
      gameContractAddress,
      encodedAbi,
      1e7,
    );
    //signing the TypedV4 data
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
      //initiating the enterGame Transaction
      const result = await minimalForwarderInstance.methods
        .execute(request, signature)
        .send();
      console.log(
        `Transaction for enter game completed with Transaction Hash ${result.transactionHash}`,
      );
    } else {
      throw new Error('Invalid Signature');
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

export { enterGame };
