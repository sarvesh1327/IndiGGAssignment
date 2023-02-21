import { Types } from 'mongoose';
import playersModel from '../models/players.model';

const players = playersModel();

//fetches all the players for a tournament with tournament id
async function getAllByTournamentId(args: { tournamentId: string }) {
  const { tournamentId } = args || {};
  return players
    .find({ tournamentId })
    .populate(['userId'])
    .sort({ score: -1 })
    .exec();
}

//creates a new player for a tournament
async function create(args: { tournamentId: string; userId: Types.ObjectId }) {
  const { tournamentId, userId } = args || {};
  return players.create({
    tournamentId,
    userId,
    score: 0,
    scoreSubmitted: false,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  });
}

//gets a player's details for tournamentId ans userId
async function getByTournamentIdAndUserId(args: {
  tournamentId: string;
  userId: Types.ObjectId;
}) {
  const { tournamentId, userId } = args || {};
  return players.findOne({ tournamentId, userId }).exec();
}

//updates the score of the player
async function updateScore(args: {
  tournamentId: string;
  userId: Types.ObjectId;
  score: number;
}) {
  const { tournamentId, userId, score } = args || {};
  return players
    .updateOne(
      { tournamentId, userId },
      {
        $set: { score, updatedAt: new Date().toISOString() },
      },
    )
    .exec();
}

//submits the score for a player
async function submitScore(args: { playerId: Types.ObjectId }) {
  const { playerId } = args || {};
  return players
    .updateOne(
      { _id: playerId },
      { $set: { scoreSubmitted: true, updatedAt: new Date().toISOString() } },
    )
    .exec();
}

//fetches all the users with unsubmitted score when the tournament expires
async function playersWithUnsubmittedScore(args: { tournamentId: string }) {
  const { tournamentId } = args || {};
  return players
    .find({ tournamentId, scoreSubmitted: false })
    .populate(['userId'])
    .exec();
}

//Submits the scores for the all the unsbumitted players when tournament expires
async function updateManyToScoreSubmitted(args: {
  playerIds: [Types.ObjectId] | [];
}) {
  const { playerIds } = args || {};
  return players
    .updateMany(
      { _id: { $in: playerIds } },
      { $set: { scoreSubmitted: true, updatedAt: new Date().toISOString() } },
    )
    .exec();
}

export const playersService = () => ({
  getAllByTournamentId,
  create,
  getByTournamentIdAndUserId,
  updateScore,
  submitScore,
  playersWithUnsubmittedScore,
  updateManyToScoreSubmitted,
});
