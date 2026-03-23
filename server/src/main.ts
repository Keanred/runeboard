import cors from 'cors';
import express from 'express';
import http from 'http';
import tasksRouter from './routes/tasks';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
