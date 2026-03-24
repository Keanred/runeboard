import { Request, Response, Router } from 'express';
import { deleteTask, getAllTasks, getColumns, insertTask, updateTask } from '../store';
import { Column, ColumnId, Task } from '../types';

const tasksRouter = Router();

tasksRouter.get('/', (_req: Request, res: Response<{ columns: Column[]; tasks: Task[] }>) => {
  return res.json({
    columns: getColumns(),
    tasks: getAllTasks(),
  });
});

tasksRouter.post('/', (req: Request, res: Response) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    title: req.body.title,
    description: req.body.description || '',
    columnId: ColumnId.TODO,
    order: 0,
  };
  const result = insertTask(newTask);
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
  const { title, description, columnId, order } = req.body;
  const updates: Partial<Task> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (columnId !== undefined) updates.columnId = columnId;
  if (order !== undefined) updates.order = order;

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
  res.status(204).send();
});

export default tasksRouter;
