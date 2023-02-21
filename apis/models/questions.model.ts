import { Schema } from 'mongoose';
import { tournamentDB } from '../utils/connection';

interface Iquestion {
  title: string;
}

function questionsModel() {
  const schema = new Schema<Iquestion>({
    title: String,
  });
  const model = tournamentDB.model('QUESTIONS', schema, 'QUESTIONS');
  return model;
}

export default questionsModel;
