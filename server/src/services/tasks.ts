import { Column, CreateTaskInput, Task, UpdateTaskInput } from '@runeboard/schemas';
import {
    deleteTask as deleteTaskRecord,
    getAllTasks,
    getColumns,
    insertTask,
    reorderTask as reorderTaskRecord,
    updateTask as updateTaskRecord,
} from '../store';
import { InvalidColumnIdError, TaskNotFoundError } from './errors';

const isStoreNotFoundError = (error: unknown): boolean => {
    return error instanceof Error && error.message === 'Task not found';
};

const assertColumnExists = async (columnId: string): Promise<void> => {
    const columns = await getColumns();
    if (!columns.some((column) => column.id === columnId)) {
        throw new InvalidColumnIdError();
    }
};

export const getBoard = async (): Promise<{ columns: Column[]; tasks: Task[] }> => {
    const columns = await getColumns();
    const tasks = await getAllTasks();

    return { columns, tasks };
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
    await assertColumnExists(input.columnId);
    return insertTask(input);
};

export const updateTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
    if (input.columnId) {
        await assertColumnExists(input.columnId);
    }

    try {
        return await updateTaskRecord(id, input);
    } catch (error) {
        if (isStoreNotFoundError(error)) {
            throw new TaskNotFoundError();
        }

        throw error;
    }
};

export const deleteTask = async (id: string): Promise<void> => {
    try {
        await deleteTaskRecord(id);
    } catch (error) {
        if (isStoreNotFoundError(error)) {
            throw new TaskNotFoundError();
        }

        throw error;
    }
};

export const reorderTask = async (
    id: string,
    toIndex: number,
    toColumnId?: string,
): Promise<Task> => {
    if (toColumnId) {
        await assertColumnExists(toColumnId);
    }
    try {
        return await reorderTaskRecord(id, toIndex, toColumnId);
    } catch (error) {
        if (isStoreNotFoundError(error)) {
            throw new TaskNotFoundError();
        }
        throw error;
    }
};