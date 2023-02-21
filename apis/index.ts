import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import bearerToken from 'express-bearer-token';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { statusRoutes } from './routes/status';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { tournamentRoutes } from './routes/tournaments';
import { questionsRoutes } from './routes/questions';

dotenvExpand(dotenv.config());

const app: Express = express();
const port = process.env.PORT;

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bearerToken());

//All the routes
app.use(statusRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(tournamentRoutes);
app.use(questionsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
