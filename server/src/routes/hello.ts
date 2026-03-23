import { Router, Request, Response, NextFunction } from 'express';

const helloRouter = Router();

helloRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello world!' });
});

export default helloRouter;