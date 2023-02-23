import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { promisify } from 'util';
import { usersService } from '../services/users.service';
import { getErrorObject } from '../utils/helper';
import { ENV } from '../utils/constants';
const jwtSecret: Secret = ENV.JWT_SECRET;

//middleware which verify the jwt token and add user data in request for easy access later
async function authorizeUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const idToken = req.token;
    if (!idToken) {
      throw new Error(`idToken is ${idToken}`);
    }
    const decoded = await promisify(jwt.verify)(idToken, jwtSecret);
    const { id } = decoded || {};
    const userData = await usersService().findOneById({ id });
    if (!userData) {
      throw new Error('User record not present in DB.');
    }
    req.user = userData;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send(getErrorObject({ message: 'Unautorized Access' }));
  }
}

export default authorizeUserMiddleware;
