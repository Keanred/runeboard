import { v4 as UUID } from 'uuid';
import { BOARD_COLUMNS, ColumnId, NewTaskData } from './types';
import { CreateTaskInput, UpdateTaskInput, Task, Column } from '@runeboard/schemas';
import { db } from './db/client';
import { InsertTask, tasks } from './db/schema';

const todoColumn: Map<string, Task> = new Map();
const inProgressColumn: Map<string, Task> = new Map();
const doneColumn: Map<string, Task> = new Map();

const store: Record<ColumnId, Map<string, Task>> = {
  [ColumnId.TODO]: todoColumn,
  [ColumnId.IN_PROGRESS]: inProgressColumn,
  [ColumnId.DONE]: doneColumn,
};

const ensureColumnStore = (columnId: ColumnId): Map<string, Task> => {
  if (!store[columnId]) {
    store[columnId] = new Map();
  }
  return store[columnId];
};

export const insertTask = async (taskData: CreateTaskInput): Promise<Task> => {
  const task = taskData;
  const newTask: InsertTask = {
    id: UUID(),
    title: task.title,
    description: task.description,
    columnId: task.columnId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const [createdTask] = await db.insert(tasks).values({
    ...task,
    id: UUID(),
    title: task.title,
    description: task.description,
    columnId: task.columnId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).returning();

  const normalizedTask: Task = {
    ...createdTask,
    description: createdTask.description ?? undefined,
  };

  ensureColumnStore(normalizedTask.columnId).set(normalizedTask.id, normalizedTask);

  return normalizedTask;
};

export const updateTask = (taskId: string, updates: UpdateTaskInput): Task => {
  let existingTask: Task | undefined;
  let oldColumnId: ColumnId | undefined;
  for (const [columnId, column] of Object.entries(store) as [ColumnId, Map<string, Task>][]) {
    const found = column.get(taskId);
    if (found) {
      existingTask = found;
      oldColumnId = columnId;
      break;
    }
  }
  if (!existingTask || !oldColumnId) {
    throw new Error('Task not found');
  }
  const updatedTask: Task = {
    ...existingTask,
    ...updates,
    id: existingTask.id,
    createdAt: existingTask.createdAt,
    updatedAt: new Date().toISOString(),
  };
  if (updates.columnId && updates.columnId !== oldColumnId) {
    store[oldColumnId].delete(taskId);
  }
  ensureColumnStore(updatedTask.columnId).set(taskId, updatedTask);
  return updatedTask;
};

export const deleteTask = (taskId: string) => {
  let task = null;
  for (const column of Object.values(store)) {
    if (column.has(taskId)) {
      task = column.get(taskId);
      column.delete(taskId);
      return task;
    }
  }
};

export const getTasksByColumn = (columnId: ColumnId): Task[] => {
  return Array.from(ensureColumnStore(columnId).values());
};

export const getColumns = (): Column[] => {
  return [...BOARD_COLUMNS];
};

export const getAllTasks = (): Task[] => {
  return BOARD_COLUMNS.flatMap((column) => Array.from(ensureColumnStore(column.id).values()));
};

const seedTasks: NewTaskData[] = [
  {
    title: 'Design database schema',
    description: 'Define tables and relationships for the production DB.',
    columnId: ColumnId.TODO,
    order: 0,
  },
  {
    title: 'Write API integration tests',
    description: 'Cover all task CRUD endpoints with integration tests.',
    columnId: ColumnId.TODO,
    order: 1,
  },
  {
    title: 'Implement drag-and-drop',
    description: 'Allow tasks to be reordered and moved between columns.',
    columnId: ColumnId.IN_PROGRESS,
    order: 0,
  },
  {
    title: 'Set up CI pipeline',
    description: 'Configure GitHub Actions to run lint, typecheck, and tests on every PR.',
    columnId: ColumnId.IN_PROGRESS,
    order: 1,
  },
  {
    title: 'Initialise monorepo',
    description: 'Create client and server workspaces with shared root package.json.',
    columnId: ColumnId.DONE,
    order: 0,
  },
];

seedTasks.forEach((task) => insertTask(task));
