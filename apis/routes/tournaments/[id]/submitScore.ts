import { Router, Request, Response } from 'express';
import authorizeUserMiddleware from '../../../middlewares/authorizeUser.middleware';
import { tournamentService } from '../../../services/tournaments.service';
import { playersService } from '../../../services/players.service';
import { addScore } from '../../../livecopy/addScore';
import { getErrorObject } from '../../../utils/helper';

const router = Router();

//submits the score for the user
async function submitScore(req: Request, res: Response) {
  try {
    const { _id: userId, walletAddress } = req.user || {};
    const { id } = req.params || {};
    //fetching the tournament details to confirm correct tournament Id
    const tournamentData = await tournamentService().findOneById({ id });
    if (!tournamentData) {
      console.log('Invalid tournament Id %s', id);
      res
        .status(400)
        .send(getErrorObject({ message: 'Invalid tournament Id' }));
      return;
    }
    const { gameId } = tournamentData || {};
    const playerData = await playersService().getByTournamentIdAndUserId({
      tournamentId: id,
      userId,
    });
    //confirms if user is indeed a player for this tournament
    if (!playerData) {
      console.log('Not a player %s', userId);
      res
        .status(400)
        .send(getErrorObject({ message: 'You did not enter this tournament' }));
      return;
    }
    const { _id: playerId, scoreSubmitted, score } = playerData || {};
    //confirms if user has not priorly submitted the score
    if (scoreSubmitted) {
      console.log('Score is already submitted by user %s', userId);
      res
        .status(400)
        .send(
          getErrorObject({ message: 'Your score has already been submitted' }),
        );
      return;
    }
    //adds the score to blockchain here then updates the scoreSubmitted status in DB
    await addScore(gameId, score, walletAddress);
    await playersService().submitScore({ playerId });
    res.status(200).send({ success: true, message: 'Score Submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.patch(
  '/tournaments/:id/submitScore',
  authorizeUserMiddleware,
  submitScore,
);

export const submitScoreRoute = router;
