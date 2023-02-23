import { Router, Request, Response } from 'express';
import authorizeUserMiddleware from '../../../middlewares/authorizeUser.middleware';
import { tournamentService } from '../../../services/tournaments.service';
import { playersService } from '../../../services/players.service';
import * as livecopyEnterGame from '../../../livecopy/enterGame';
import expireTournament from '../../../helpers/expireTournaments';
import { getErrorObject } from '../../../utils/helper';
import { ENV } from '../../../utils/constants';

const router = Router();

//allows a user to enter a game/Tournament
async function enterGame(req: Request, res: Response) {
  try {
    const { _id: userId, walletAddress } = req.user || {};
    const { id } = req.params || {};
    const tournamentData = await tournamentService().findOneById({ id });
    //confirms if tournamentId is correct or not
    if (!tournamentData) {
      console.log('Invalid tournament Id %s', id);
      res
        .status(400)
        .send(getErrorObject({ message: 'Invalid tournament Id' }));
      return;
    }
    const { status, currentPlayers, gameId } = tournamentData || {};
    //confirms that tournament has not yet started or ended for the user
    if (status !== 'PENDING') {
      console.log('Status is not pending it is %s', status);
      res
        .status(400)
        .send(
          getErrorObject({ message: 'Tournament has already started. Sorry' }),
        );
      return;
    }
    const totalPlayers: number = +ENV.TOTAL_PLAYERS;
    //checks that player capacity is not filled
    if (currentPlayers >= totalPlayers) {
      console.log('Capacity fullfilled current players are %d', currentPlayers);
      res.status(400).send(
        getErrorObject({
          message: 'Tournament has been filled to the capacity',
        }),
      );
      return;
    }
    const userPlayerData = await playersService().getByTournamentIdAndUserId({
      tournamentId: id,
      userId,
    });
    //checks if user is already a player of this tournament. If so they cannot reenter
    if (userPlayerData) {
      console.log('Already a player %s', userId);
      res.status(400).send(
        getErrorObject({
          message: 'You have already entered the tournament',
        }),
      );
      return;
    }
    // enters the game for user in blockchain then create a new player doc for the user
    await livecopyEnterGame.enterGame(gameId, walletAddress);
    await playersService().create({
      tournamentId: id,
      userId,
    });
    //updates the currentPlayer number and status if capacity is filled
    await tournamentService().updateCurrentPlayersAndUpdateStatus({
      id,
      currentPlayers: currentPlayers + 1,
    });
    const tournamentNewData = await tournamentService().findOneById({ id });
    if (tournamentNewData?.status === 'STARTED') {
      //if tournament is filled to it's capacity we put a delay and wait for the tornament to expire
      expireTournament(id);
    }
    res.status(200).send({ success: true, data: tournamentNewData });
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.post('/tournaments/:id/enterGame', authorizeUserMiddleware, enterGame);

export const enterGameRoute = router;
