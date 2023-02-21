import userModel from '../models/users.model';

const users = userModel();

//creates new user
async function create(args: { walletAddress: string }) {
  const { walletAddress } = args;
  return users.create({
    walletAddress,
    createdAt: new Date().toISOString(),
  });
}

//fetches user details with walletAddress
async function findOneByWalletAddress(args: { walletAddress: string }) {
  const { walletAddress } = args;
  return users.findOne({ walletAddress }).exec();
}

//fetches user details with id
async function findOneById(args: { id: string }) {
  return users.findById(args.id).exec();
}

export const usersService = () => ({
  create,
  findOneByWalletAddress,
  findOneById,
});
