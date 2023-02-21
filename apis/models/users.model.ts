import { Schema } from 'mongoose';
import { tournamentDB } from '../utils/connection';

interface Iuser {
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

function userModel() {
  const schema = new Schema<Iuser>({
    walletAddress: String,
    createdAt: Date,
    updatedAt: Date,
  });

  const model = tournamentDB.model('USERS', schema, 'USERS');
  return model;
}

export default userModel;
