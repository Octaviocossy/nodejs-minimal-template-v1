import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Output } from '@hapi/boom';

import { TMiddlewareErrorParams } from '../models';
import { logger } from '../utilities';

export interface BoomError extends ErrorRequestHandler {
  isBoom: boolean;
  output: Output;
}

export const boomErrorHandler: TMiddlewareErrorParams<BoomError> = (err, _req, res, next) => {
  if (err.isBoom) {
    const { output } = err;

    logger.error(output.payload);

    return res.status(output.statusCode).json({ ...output.payload, isBoom: true });
  }

  return next(err);
};

export const zodErrorHandler: TMiddlewareErrorParams<ZodError> = (err, _req, res, next) => {
  if (err instanceof ZodError) {
    logger.error(err.issues);

    return res.status(400).json(
      err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }))
    );
  }

  return next(err);
};

export const errorHandler: TMiddlewareErrorParams<Error> = (err, _req, res, _next) => {
  logger.error(err);

  return res.status(500).json({ msg: err.message, stack: err.stack });
};
