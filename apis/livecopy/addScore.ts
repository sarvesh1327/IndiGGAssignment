import { helperMFDataToSign } from './utils/minimalForwarderSignature';
import {
  minimalForwarderInstance,
  gameContractInstance,
} from './utils/contractInstances';
import signTypedData from './utils/signData';
import { delayWithTime } from '../utils/helper';
import { ENV } from '../utils/constants';
const gameContractAddress = ENV.gameContractAddress;

//it submits/add score for a player in blockchain with for a game
async function addScore(
  gameId: number,
  score: number,
  player: string | undefined,
) {
  try {
    let account = ENV.ADMIN_PUBLIC_KEY;
    console.log(`Adding the score for player ${player} in game ${gameId}`);
    await delayWithTime(10);
    //encoding the method for adding the score on gameContract
    const encodedAbi = gameContractInstance.methods
      .addScore(gameId, score, player)
      .encodeABI();
    const { nonce, toSign } = await helperMFDataToSign(
      account,
      gameContractAddress,
      encodedAbi,
      1e7,
    );
    //signing TypeV4 data for our forwarder
    const signature = await signTypedData(ENV.ADMIN_PRIVATE_KEY, toSign);
    const request = {
      from: account,
      to: gameContractAddress,
      value: 0,
      gas: 1e7,
      nonce,
      data: encodedAbi,
    };
    //validating the signature
    const valid = await minimalForwarderInstance.methods
      .verify(request, signature)
      .call();
    console.log('signature is valid?', valid);
    if (valid) {
      //initiating the transaction
      const result = await minimalForwarderInstance.methods
        .execute(request, signature)
        .send();
      console.log(
        `Transaction for addScore completed with Transaction Hash ${result.transactionHash}`,
      );
    } else {
      throw new Error('Invalid Signature');
    }
    return true;
  } catch (error) {
    console.error(error);
  }
}

export { addScore };
