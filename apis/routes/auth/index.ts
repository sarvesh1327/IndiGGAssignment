import Router, { Request, Response } from 'express';
import Web3 from 'web3';
import { verifyRoute } from './verify';
import { authService } from '../../services/auth.service';
import { getErrorObject } from '../../utils/helper';
const router = Router();
const web3Instance = new Web3();

//creates an otp to sign by user
async function createAuth(req: Request, res: Response) {
  try {
    const { publicKey } = req.body || {};
    const isWeb3Address = web3Instance.utils.isAddress(publicKey);
    if (!isWeb3Address) {
      console.log('Invalid PublicKey %s', publicKey);
      res.status(400).send(
        getErrorObject({
          message: 'This address is not valid. Please enter a valid address',
        }),
      );
      return;
    }
    //creating the otp doc for publicKey
    const authData = await authService().createAuthOtp(publicKey.toLowerCase());
    res.send(authData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
}

//routing the patch route of verifying the auth otp through here
router.use(verifyRoute);
router.post('/auth', createAuth);

export const authRoutes = router;
