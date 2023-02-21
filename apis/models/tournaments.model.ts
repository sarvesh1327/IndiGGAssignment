import { Schema } from 'mongoose';
import { tournamentDB } from '../utils/connection';

interface Itournament {
  gameId: number;
  name: string;
  currentPlayers: number;
  totalQuestions: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  expireAt: Date;
}

function tournamentModel() {
  const schema = new Schema<Itournament>({
    gameId: Number,
    name: String,
    currentPlayers: Number,
    totalQuestions: Number,
    status: String,
    createdAt: Date,
    updatedAt: Date,
    expireAt: Date,
  });

  const model = tournamentDB.model('TOURNAMENTS', schema, 'TOURNAMENTS');
  return model;
}

export default tournamentModel;
