import cors from 'cors';
import express from 'express';
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
