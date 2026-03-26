import { v4 as UUID } from 'uuid';
import { ColumnId } from './types';
import { CreateTaskInput, UpdateTaskInput, Task, Column } from '@runeboard/schemas';
import { db } from './db/client';
import { InsertTask, SelectColumn, SelectTask, tasks, columns } from './db/schema';
import { asc, eq } from 'drizzle-orm';

const toTask = (task: SelectTask): Task => ({
  ...task,
  description: task.description ?? undefined,
});

const toColumn = (column: SelectColumn): Column => ({
  ...column,
});

export const insertTask = async (taskData: CreateTaskInput): Promise<Task> => {
  const newTask: InsertTask = {
    id: UUID(),
    title: taskData.title,
    description: taskData.description,
    columnId: taskData.columnId,
    order: taskData.order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const [createdTask] = await db.insert(tasks).values(newTask).returning();

  return toTask(createdTask);
};

export const updateTask = async (taskId: string, updates: UpdateTaskInput): Promise<Task> => {
  const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!existingTask) {
    throw new Error('Task not found');
  }

  const updatedTaskData = {
    ...existingTask,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const [updatedTask] = await db
    .update(tasks)
    .set({
      title: updatedTaskData.title,
      description: updatedTaskData.description,
      columnId: updatedTaskData.columnId,
      order: updatedTaskData.order,
      updatedAt: updatedTaskData.updatedAt,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  return toTask(updatedTask);
};

export const deleteTask = async (taskId: string): Promise<Task> => {
  const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!existingTask) {
    throw new Error('Task not found');
  }

  await db.delete(tasks).where(eq(tasks.id, taskId));

  return toTask(existingTask);
};

export const getTasksByColumn = async (columnId: ColumnId): Promise<Task[]> => {
  const existingTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.columnId, columnId))
    .orderBy(asc(tasks.order), asc(tasks.id));
  return existingTasks.map(toTask);
};

export const getColumns = async (): Promise<Column[]> => {
  const existingColumns = await db.select().from(columns).orderBy(asc(columns.order), asc(columns.id));
  return existingColumns.map(toColumn);
};

export const getAllTasks = async (): Promise<Task[]> => {
  const existingTasks = await db
    .select()
    .from(tasks)
    .orderBy(asc(tasks.columnId), asc(tasks.order), asc(tasks.id));
  return existingTasks.map(toTask);
};

