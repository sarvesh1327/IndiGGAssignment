import { Schema, Types } from 'mongoose';
import { tournamentDB } from '../utils/connection';

export interface Iplayer {
  _id: Types.ObjectId;
  tournamentId: Types.ObjectId;
  userId: Types.ObjectId;
  score: number;
  scoreSubmitted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function playersModel() {
  const schema = new Schema({
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
