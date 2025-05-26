import { TMiddlewareParams } from '../models';
import { Prisma } from '../config';
import { DELETE_TASK_SCHEMA_TYPE, TASK_SCHEMA_TYPE, UPDATE_TASK_SCHEMA_TYPE } from '../schemas';

export const get_all: TMiddlewareParams = async (_req, res, next) => {
  try {
    const tasks = await Prisma.task.findMany();

    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
};

export const create: TMiddlewareParams = async (req, res, next) => {
  try {
    const { body } = req as unknown as TASK_SCHEMA_TYPE;

    const task = await Prisma.task.create({
      data: {
        title: body.title,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

export const update: TMiddlewareParams = async (req, res, next) => {
  try {
    const { body, query } = req as unknown as UPDATE_TASK_SCHEMA_TYPE;

    const task = await Prisma.task.update({
      where: {
        id: query.id,
      },
      data: {
        title: body.title,
        completed: body.completed,
      },
    });

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

export const remove: TMiddlewareParams = async (req, res, next) => {
  try {
    const { query } = req as unknown as DELETE_TASK_SCHEMA_TYPE;

    await Prisma.task.delete({
      where: {
        id: query.id,
      },
    });

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return next(error);
  }
};
