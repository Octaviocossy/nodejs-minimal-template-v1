import express, { Router } from 'express';

import * as Controller from '@/controllers/tasks.controller';
import { zodValidator } from '@/middlewares';

import { DELETE_TASK_SCHEMA, TASK_SCHEMA, UPDATE_TASK_SCHEMA } from '@/schemas';

const router: Router = express.Router();

router.get('/get-all', Controller.get_all);
router.post('/create', zodValidator(TASK_SCHEMA), Controller.create);
router.put('/update', zodValidator(UPDATE_TASK_SCHEMA), Controller.update);
router.delete('/delete', zodValidator(DELETE_TASK_SCHEMA), Controller.remove);

export { router as TasksRouter };
