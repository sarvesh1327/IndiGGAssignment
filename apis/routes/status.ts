import { Router } from 'express';

const router = Router();

import { tournamentDB } from '../utils/connection';

//confirms if mongoDb is connected or not
router.get('/status', (req, res) => {
  res.send({
    status: tournamentDB.id ? 'SUCCESS' : 'ERROR',
  });
  return;
});

export const statusRoutes = router;
