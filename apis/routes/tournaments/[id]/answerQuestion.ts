import { Router, Request, Response } from 'express';
import { differenceInSeconds } from 'date-fns';
import authorizeUserMiddleware from '../../../middlewares/authorizeUser.middleware';
import { tournamentService } from '../../../services/tournaments.service';
import { playersService } from '../../../services/players.service';
import { getErrorObject } from '../../../utils/helper';

const router = Router();

// Answers and update the Score in DB
async function answerQuestion(req: Request, res: Response) {
  try {
    const { _id: userId } = req.user || {};
    const { id } = req.params || {};
    const { questionNumber, answer } = req.query || {};
    console.log(
      `Answering the question ${questionNumber} and updating the score accordingly`,
    );
    //checking if tournamentId is correct or not
    const tournamentData = await tournamentService().findOneById({ id });
    if (!tournamentData) {
      console.log('Invalid tournament Id %s', id);
      res
        .status(400)
        .send(getErrorObject({ message: 'Invalid tournament Id' }));
      return;
    }
    const { expireAt, status } = tournamentData || {};
    //confirming if tournament is still running
    if (
      status !== 'STARTED' ||
      differenceInSeconds(expireAt, new Date()) < -5
    ) {
      console.log('Tournament has expired');
      res.status(400).send(getErrorObject({ message: `Tournament is over` }));
      return;
    }
    //confirming of the user is indeed the player of this tournament
    const playerData = await playersService().getByTournamentIdAndUserId({
      tournamentId: id,
      userId,
    });
    if (!playerData) {
      console.log('Not a player %s', userId);
      res
        .status(400)
        .send(getErrorObject({ message: 'You did not enter this tournament' }));
      return;
    }
    const { scoreSubmitted, score } = playerData || {};
    //not allowing to add score if scores are already submitted to blockchain
    if (scoreSubmitted) {
      console.log('Score is already submitted by user %s', userId);
      res
        .status(400)
        .send(
          getErrorObject({ message: 'Your score has already been submitted' }),
        );
      return;
    }
    //updating the score
    const updatePlayerData = await playersService().updateScore({
      tournamentId: id,
      userId,
      score: answer === 'true' ? score + 1 : score,
    });
    if (updatePlayerData.modifiedCount) {
      console.log('ScoreAdded, answer questioned');
      res.status(200).send({ success: true, message: 'Question answered' });
      return;
    }
    throw new Error('Error while updating score');
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.patch(
  '/tournaments/:id/answerQuestion',
  authorizeUserMiddleware,
  answerQuestion,
);

export const answerQuestionRoute = router;
