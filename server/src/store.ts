import { v4 as UUID } from 'uuid';
import { BOARD_COLUMNS, ColumnData, ColumnId, NewTaskData, TaskData } from './types';

const todoColumn: Map<string, TaskData> = new Map();
const inProgressColumn: Map<string, TaskData> = new Map();
const doneColumn: Map<string, TaskData> = new Map();

const store: Record<ColumnId, Map<string, TaskData>> = {
  [ColumnId.TODO]: todoColumn,
  [ColumnId.IN_PROGRESS]: inProgressColumn,
  [ColumnId.DONE]: doneColumn,
};

export const insertTask = (task: NewTaskData): TaskData => {
  const now = new Date().toISOString();
  const createdTask = {
    ...task,
    id: UUID(),
    createdAt: now,
    updatedAt: now,
  };
  store[createdTask.columnId].set(createdTask.id, createdTask);

  return createdTask;
};

export const updateTask = (taskId: string, updates: Partial<Omit<TaskData, 'id' | 'createdAt' | 'updatedAt'>>): TaskData => {
  let existingTask: TaskData | undefined;
  let oldColumnId: ColumnId | undefined;
  for (const [columnId, column] of Object.entries(store) as [ColumnId, Map<string, TaskData>][]) {
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
  const updatedTask: TaskData = {
    ...existingTask,
    ...updates,
    id: existingTask.id,
    createdAt: existingTask.createdAt,
    updatedAt: new Date().toISOString(),
  };
  if (updates.columnId && updates.columnId !== oldColumnId) {
    store[oldColumnId].delete(taskId);
  }
  store[updatedTask.columnId].set(taskId, updatedTask);
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

export const getTasksByColumn = (columnId: ColumnId): TaskData[] => {
  return Array.from(store[columnId].values());
};

export const getColumns = (): ColumnData[] => {
  return [...BOARD_COLUMNS];
};

export const getAllTasks = (): TaskData[] => {
  return BOARD_COLUMNS.flatMap((column) => Array.from(store[column.id].values()));
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
