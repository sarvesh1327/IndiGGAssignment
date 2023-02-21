import { Router, Request, Response } from 'express';
import authorizeUserMiddleware from '../../middlewares/authorizeUser.middleware';
import { questionsService } from '../../services/questions.service';
import { getErrorObject } from '../../utils/helper';
const router = Router();

//getting all the questions
async function getAll(req: Request, res: Response) {
  try {
    console.log('Gets all the questions from the DB and sends them to UI');
    const questions = await questionsService().findAll();
    res.send(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.get('/questions', authorizeUserMiddleware, getAll);

export const questionsRoutes = router;
