import { Schema, Types, PopulatedDoc } from 'mongoose';
import { tournamentDB } from '../utils/connection';
import { Iuser } from './users.model';

export interface Iplayer {
  _id: Types.ObjectId;
  tournamentId: Types.ObjectId;
  userId: PopulatedDoc<Iuser>;
  score: number;
  scoreSubmitted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function playersModel() {
  const schema = new Schema<Iplayer>({
    tournamentId: Types.ObjectId,
    userId: { type: Types.ObjectId, ref: 'USERS' },
    score: Number,
    scoreSubmitted: Boolean,
    createdAt: Date,
    updatedAt: Date,
  });

  const model = tournamentDB.model('PLAYERS', schema, 'PLAYERS');

  return model;
}

export default playersModel;
