import { Router, Request, Response } from 'express';
import authorizeUserMiddleware from '../../../middlewares/authorizeUser.middleware';
import { tournamentService } from '../../../services/tournaments.service';
import { playersService } from '../../../services/players.service';
import { enterGameRoute } from './enterGame';
import { answerQuestionRoute } from './answerQuestion';
import { submitScoreRoute } from './submitScore';
import { playersRoute } from './players';
import { getErrorObject } from '../../../utils/helper';

const router = Router();

//fetches the tournament by Id and also sends if user is the player or not
async function getOneById(req: Request, res: Response) {
  try {
    const { id } = req.params || {};
    const { _id: userId } = req.user || {};
    console.log(
      `Fetching tournament details for ${id} and playerData for ${userId} and sending to UI`,
    );
    const tournamentData = await tournamentService().findOneById({ id });
    //confirms if tournament id is correct
    if (!tournamentData) {
      console.log('Invalid tournament Id %s', id);
      res
        .status(400)
        .send(getErrorObject({ message: 'Invalid tournament Id' }));
      return;
    }
    //fetches the playerData to see user is a player of this tournament or not
    const playerData = await playersService().getByTournamentIdAndUserId({
      tournamentId: id,
      userId,
    });
    if (playerData) {
      res.send({ ...tournamentData._doc, isPlayer: true });
      return;
    }
    res.send(tournamentData);
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

//all the routes with /id for tournaments are routed through here
router.use(enterGameRoute);
router.use(answerQuestionRoute);
router.use(submitScoreRoute);
router.use(playersRoute);
router.get('/tournaments/:id', authorizeUserMiddleware, getOneById);

export const byIdTournamentRoutes = router;
