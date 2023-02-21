import questionsModel from '../models/questions.model';
const questions = questionsModel();

//fetches all the questions
async function findAll() {
  return questions.find().exec();
}

export const questionsService = () => ({ findAll });
