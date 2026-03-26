import { Request, Response, Router } from 'express';
import { deleteTask, getAllTasks, getColumns, insertTask, updateTask } from '../store';
import { Column, Task, createTaskSchema, updateTaskSchema } from '@runeboard/schemas';

import { ColumnId } from '../types';

const tasksRouter = Router();

tasksRouter.get('/', (_req: Request, res: Response<{ columns: Column[]; tasks: Task[] }>) => {
  const columns: Column[] = getColumns();
  const tasks: Task[] = getAllTasks();
  return res.json({
    columns,
    tasks,
  });
});

tasksRouter.post('/', async (req: Request, res: Response) => {
  const newTask = createTaskSchema.safeParse(req.body);
  if (!newTask.success) {
    const message = newTask.error.issues.map((i) => i.message).join(', ');
    return res.status(400).json({ error: `Invalid task data: ${message}` });
  }
  if (!getColumns().some((col) => col.id === newTask.data.columnId)) {
    return res.status(400).json({ error: 'Invalid columnId' });
  }
  const result: Task = await insertTask(newTask.data);
  if (!result) {
    return res.status(400).json({ error: 'Failed to create task' });
  }
  res.status(201).json(result);
});

tasksRouter.patch('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  const parsedUpdates = updateTaskSchema.safeParse(req.body);
  if (!parsedUpdates.success) {
    const message = parsedUpdates.error.issues.map((i) => i.message).join(', ');
    return res.status(400).json({ error: `Invalid task data: ${message}` });
  }
  const updates = parsedUpdates.data;
  const { columnId } = updates;

  if (columnId && !getColumns().some((col) => col.id === columnId)) {
    return res.status(400).json({ error: 'Invalid columnId' });
  }

  try {
    const result = updateTask(id, updates);
    res.status(200).json(result);
  } catch {
    return res.status(404).json({ error: 'Task not found' });
  }
});

tasksRouter.delete('/:id', (req: Request<{ id: string}>, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }
  const result = deleteTask(id);
  if (!result) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).end();
});

export default tasksRouter;
