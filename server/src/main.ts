import cors from 'cors';
import express from 'express';
import http from 'http';
import tasksRouter from './routes/tasks';

const app = express();
const port = process.env.PORT || 8080;

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

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
