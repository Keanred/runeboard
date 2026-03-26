import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import tasksRouter from './routes/tasks';

export const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

app.use('/api/tasks', tasksRouter);

app.use(((err, _req, res, _next) => {
  console.error(err);
  const status = (err as { status?: number; statusCode?: number }).status
    ?? (err as { status?: number; statusCode?: number }).statusCode
    ?? 500;
  res.status(status).json({ error: (err as Error).message ?? 'Internal server error' });
}) as ErrorRequestHandler);
