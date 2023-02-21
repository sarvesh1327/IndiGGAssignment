import mongoose from 'mongoose';
import { ENV } from './constants';
const { MONGODB_URI } = ENV;

function getMongoConnection() {
  try {
    const connection = mongoose.createConnection(MONGODB_URI);
    return connection;
  } catch (error) {
    console.error(error);
  }
}

const tournamentDB = getMongoConnection();

export { tournamentDB };
