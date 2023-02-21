import jwt, { Secret } from 'jsonwebtoken';
import Web3 from 'web3';
import { Types } from 'mongoose';
import { ENV } from './constants';
const jwtSecret: Secret = ENV.JWT_SECRET;

const web3Instance = new Web3();

//Helper function that returns error Object with success as false and message as one argument
function getErrorObject(args: { message: string }) {
  return { success: false, message: args.message };
}

//Helper function To put a delay in asynchronous function
function delayWithTime(time: number) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(null);
    }, Number(time) * 1000);
  });
}

//helperFunction to create a jwt token
function signToken(id: Types.ObjectId) {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  });
}

//helper function to verify the signature signed by the user's wallet
function verifySignature(args: {
  otp: string;
  signature: string;
  publicKey: string;
}) {
  const address = web3Instance.eth.accounts.recover(args.otp, args.signature);
  return address.toLowerCase() === args.publicKey.toLowerCase();
}

export { getErrorObject, delayWithTime, signToken, verifySignature };
