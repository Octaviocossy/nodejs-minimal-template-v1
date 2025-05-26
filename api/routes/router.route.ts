import express, { Express } from 'express';

import { TasksRouter } from './tasks.route';

export const Router = (app: Express) => {
  const router = express.Router();

  app.use('/api', router);

  router.use('/tasks', TasksRouter);
};
