import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidColumnIdError, TaskNotFoundError } from './errors';
import { createTask, deleteTask, getBoard, updateTask } from './tasks';
import {
  deleteTask as deleteTaskRecord,
  getAllTasks,
  getColumns,
  insertTask,
  updateTask as updateTaskRecord,
} from '../store';

vi.mock('../store', () => ({
  deleteTask: vi.fn(),
  getAllTasks: vi.fn(),
  getColumns: vi.fn(),
  insertTask: vi.fn(),
  updateTask: vi.fn(),
}));

const mockedGetColumns = vi.mocked(getColumns);
const mockedGetAllTasks = vi.mocked(getAllTasks);
const mockedInsertTask = vi.mocked(insertTask);
const mockedUpdateTask = vi.mocked(updateTaskRecord);
const mockedDeleteTask = vi.mocked(deleteTaskRecord);

describe('tasks service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getBoard returns columns and tasks from the store', async () => {
    mockedGetColumns.mockResolvedValue([{ id: 'TODO', title: 'To Do', order: 0 }]);
    mockedGetAllTasks.mockResolvedValue([
      {
        id: 'task-1',
        title: 'Write tests',
        description: undefined,
        columnId: 'TODO',
        order: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);

    await expect(getBoard()).resolves.toEqual({
      columns: [{ id: 'TODO', title: 'To Do', order: 0 }],
      tasks: [
        {
          id: 'task-1',
          title: 'Write tests',
          description: undefined,
          columnId: 'TODO',
          order: 0,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });
  });

  it('createTask rejects an invalid columnId before inserting', async () => {
    mockedGetColumns.mockResolvedValue([{ id: 'TODO', title: 'To Do', order: 0 }]);

    await expect(
      createTask({ title: 'New task', columnId: 'DONE', order: 0 }),
    ).rejects.toBeInstanceOf(InvalidColumnIdError);

    expect(mockedInsertTask).not.toHaveBeenCalled();
  });

  it('createTask inserts when the column exists', async () => {
    const createdTask = {
      id: 'task-2',
      title: 'New task',
      description: 'Details',
      columnId: 'TODO',
      order: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    mockedGetColumns.mockResolvedValue([{ id: 'TODO', title: 'To Do', order: 0 }]);
    mockedInsertTask.mockResolvedValue(createdTask);

    await expect(
      createTask({ title: 'New task', description: 'Details', columnId: 'TODO', order: 1 }),
    ).resolves.toEqual(createdTask);
  });

  it('updateTask maps store missing-task errors to TaskNotFoundError', async () => {
    mockedUpdateTask.mockRejectedValue(new Error('Task not found'));

    await expect(updateTask('missing-task', { title: 'Updated title' })).rejects.toBeInstanceOf(
      TaskNotFoundError,
    );
  });

  it('updateTask rethrows unexpected store errors', async () => {
    mockedUpdateTask.mockRejectedValue(new Error('DB unavailable'));

    await expect(updateTask('task-1', { title: 'Updated title' })).rejects.toThrow('DB unavailable');
  });

  it('deleteTask maps store missing-task errors to TaskNotFoundError', async () => {
    mockedDeleteTask.mockRejectedValue(new Error('Task not found'));

    await expect(deleteTask('missing-task')).rejects.toBeInstanceOf(TaskNotFoundError);
  });

  it('deleteTask rethrows unexpected store errors', async () => {
    mockedDeleteTask.mockRejectedValue(new Error('DB unavailable'));

    await expect(deleteTask('task-1')).rejects.toThrow('DB unavailable');
  });
});