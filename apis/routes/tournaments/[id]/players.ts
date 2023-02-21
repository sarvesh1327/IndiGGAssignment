import { Router, Request, Response } from 'express';
import authorizeUserMiddleware from '../../../middlewares/authorizeUser.middleware';
import { playersService } from '../../../services/players.service';
import { getErrorObject } from '../../../utils/helper';

const router = Router();

//getting all the players of a tournament to display in leaderBoard
async function getPlayers(req: Request, res: Response) {
  try {
    const { id } = req.params || {};
    console.log('Fetching and sending all the players for tournament %s', id);
    const playersData = await playersService().getAllByTournamentId({
      tournamentId: id,
    });
    res.send(playersData);
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.get('/tournaments/:id/players', authorizeUserMiddleware, getPlayers);

export const playersRoute = router;
