import { Router, Request, Response } from 'express';
import authorizeUserMiddleware from '../../middlewares/authorizeUser.middleware';
import { tournamentService } from '../../services/tournaments.service';
import { getErrorObject } from '../../utils/helper';
import { byIdTournamentRoutes } from './[id]';

const router = Router();

// gets all the tournaments to display on UI
async function getAll(req: Request, res: Response) {
  try {
    console.log('Fetching and sending all the tournaments');
    const tournaments = await tournamentService().findAll();
    res.send(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.use(byIdTournamentRoutes);
router.get('/tournaments', authorizeUserMiddleware, getAll);

export const tournamentRoutes = router;
