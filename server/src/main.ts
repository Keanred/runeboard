import express from 'express';
import http from 'http';
import cors from 'cors';
import helloRouter from './routes/hello';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/hello', helloRouter);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
