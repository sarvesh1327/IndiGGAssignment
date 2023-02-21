import { Router, Request, Response } from 'express';
import authorizeUserMiddleware from '../../middlewares/authorizeUser.middleware';
import { getErrorObject } from '../../utils/helper';

const router = Router();

// it sends user data based on bearer Token
async function getUser(req: Request, res: Response) {
  try {
    const userData = req.user;
    console.log('Sending user data');
    res.send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.get('/users', authorizeUserMiddleware, getUser);

export const userRoutes = router;
