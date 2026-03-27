import { Request, Response, Router } from 'express';
import { Column, Task, createTaskSchema, reorderTaskSchema, updateTaskSchema } from '@runeboard/schemas';
import {
  createTask,
  deleteTask,
  getBoard,
  reorderTask,
  updateTask,
} from '../services/tasks';
import { InvalidColumnIdError, TaskNotFoundError } from '../services/errors';

const tasksRouter = Router();

tasksRouter.get('/', async (_req: Request, res: Response<{ columns: Column[]; tasks: Task[] }>) => {
  const board = await getBoard();
  return res.json(board);
});

tasksRouter.post('/', async (req: Request, res: Response) => {
  const newTask = createTaskSchema.safeParse(req.body);
  if (!newTask.success) {
    const message = newTask.error.issues.map((i) => i.message).join(', ');
    return res.status(400).json({ error: `Invalid task data: ${message}` });
  }

  try {
    const result: Task = await createTask(newTask.data);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof InvalidColumnIdError) {
      return res.status(400).json({ error: error.message });
    }

    throw error;
  }
});

tasksRouter.patch('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const parsedUpdates = updateTaskSchema.safeParse(req.body);
  if (!parsedUpdates.success) {
    const message = parsedUpdates.error.issues.map((i) => i.message).join(', ');
    return res.status(400).json({ error: `Invalid task data: ${message}` });
  }
  const updates = parsedUpdates.data;

  try {
    const result = await updateTask(id, updates);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof InvalidColumnIdError) {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof TaskNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    throw error;
  }
});

tasksRouter.delete('/:id', async (req: Request<{ id: string}>, res: Response) => {
  const { id } = req.params;

  try {
    await deleteTask(id);
  } catch (error) {
    if (error instanceof TaskNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    throw error;
  }

  res.status(204).end();
});

tasksRouter.patch('/:id/reorder', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const parsed = reorderTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ');
    return res.status(400).json({ error: `Invalid reorder data: ${message}` });
  }

  const { toIndex, toColumnId } = parsed.data;

  try {
    const result = await reorderTask(id, toIndex, toColumnId);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof InvalidColumnIdError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof TaskNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    throw error;
  }
});

export default tasksRouter;
