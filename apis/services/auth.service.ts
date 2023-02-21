import { Types } from 'mongoose';
import authmodel from '../models/auth.model';
const auth = authmodel();

//create an otp for the user
async function createAuthOtp(publicKey: string) {
  return auth.create({
    publicKey,
    otp: Math.floor(Math.random() * 1000000).toString(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  });
}

//finds the otp doc with publicKey of the user and otp
async function findOneByPublicKeyAndOtp(args: {
  publicKey: string;
  otp: string;
}) {
  const { publicKey, otp } = args;
  return auth.findOne({ publicKey, otp, status: 'PENDING' }).exec();
}

//updates the auth/otp doc to verified
async function updateToVerified(args: { authId: Types.ObjectId }) {
  const { authId } = args;
  return auth
    .updateOne(
      { _id: authId },
      { $set: { status: 'VERIFIED', updatedAt: new Date().toISOString() } },
    )
    .exec();
}

export const authService = () => ({
  createAuthOtp,
  findOneByPublicKeyAndOtp,
  updateToVerified,
});
