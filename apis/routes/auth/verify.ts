import Router, { Request, Response } from 'express';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';
import { getErrorObject, signToken, verifySignature } from '../../utils/helper';

const router = Router();

//verifying the signature created by the user to log in
async function verifyAuthOtp(req: Request, res: Response) {
  try {
    const { publicKey, otp, signature } = req.body || {};
    const authData = await authService().findOneByPublicKeyAndOtp({
      publicKey,
      otp,
    });
    //checking if otp data is correct
    if (!authData) {
      console.log('Invalid Request for publicKey %s', publicKey);
      res.status(401).send(getErrorObject({ message: 'Unauthorized Access' }));
      return;
    }
    //verifying the signature
    const isSignatureValid = verifySignature({ otp, publicKey, signature });
    if (!isSignatureValid) {
      console.log('Invalid signature for publicKey %s', publicKey);
      res.status(400).send(getErrorObject({ message: 'Invalid signature' }));
      return;
    }
    const { _id: authId } = authData || {};
    //updating to verified status
    await authService().updateToVerified({ authId });
    //if there is already a user then creating the jwt token or creating the new user and then creating the jwt token
    const userFindData = await usersService().findOneByWalletAddress({
      walletAddress: publicKey,
    });
    let token = null;
    if (userFindData) {
      token = signToken(userFindData._id);
    } else {
      const userCreatedData = await usersService().create({
        walletAddress: publicKey,
      });
      token = signToken(userCreatedData._id);
    }
    res.send({ success: true, data: { token } });
  } catch (error) {
    console.error(error);
    res.status(500).send(getErrorObject({ message: 'Internal Server Error' }));
  }
}

router.patch('/auth', verifyAuthOtp);

export const verifyRoute = router;
