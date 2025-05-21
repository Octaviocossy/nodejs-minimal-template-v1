import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';

import { boomErrorHandler, errorHandler, zodErrorHandler } from '@/middlewares';

import { Router } from './routes';

const app = express();

config();

// json parser
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL ?? ''],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const port = process.env.PORT || 3001;

Router(app);

// Error Middlewares
app.use(boomErrorHandler);
app.use(zodErrorHandler);
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`[🧪]: Server is running at port: ${port}`));
