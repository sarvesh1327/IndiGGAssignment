import { Schema } from 'mongoose';
import { tournamentDB } from '../utils/connection';

interface IAuth {
  publicKey: string;
  otp: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

function authModel() {
  const schema = new Schema<IAuth>({
    publicKey: String,
    otp: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
  });

  const model = tournamentDB.model('AUTH', schema, 'AUTH');
  return model;
}

export default authModel;
