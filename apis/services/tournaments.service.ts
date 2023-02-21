import { addMinutes } from 'date-fns';
import tournamentModel from '../models/tournaments.model';
import { ENV } from '../utils/constants';
const tournaments = tournamentModel();
const totalPlayers: number = +ENV.TOTAL_PLAYERS;


//fetches tournament data with id
async function findOneById(args: { id: string }) {
  return tournaments.findById(args.id).exec();
}

//fetches all the tournaments
async function findAll() {
  return tournaments.find().exec();
}

//updates the currentPlayers and updates the status if capacity is full
async function updateCurrentPlayersAndUpdateStatus(args: {
  id: string;
  currentPlayers: number;
}) {
  const { id, currentPlayers } = args || {};
  interface Iupdate {
    currentPlayers: number;
    status: string;
    expireAt: Date | string;
    updatedAt: Date | string;
  }

  let updateData = <Iupdate>{
    currentPlayers,
  }

  if (currentPlayers === totalPlayers) {
    updateData = {
      ...updateData,
      status: 'STARTED',
      expireAt: addMinutes(new Date(), 5).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return tournaments.updateOne({ _id: id }, { $set: updateData }).exec();
}

//expires the tournament
async function expireTournament(args: { id: string }) {
  const { id } = args || {};
  return tournaments
    .updateOne(
      { _id: id },
      { status: 'ENDED', updatedAt: new Date().toISOString() },
    )
    .exec();
}

export const tournamentService = () => ({
  findOneById,
  findAll,
  updateCurrentPlayersAndUpdateStatus,
  expireTournament,
});
