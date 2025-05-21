import express, { Express } from 'express';

import { TasksRouter } from '@/routes';

export const Router = (app: Express) => {
  const router = express.Router();

  app.use('/api', router);

  router.use('/tasks', TasksRouter);
};
