import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTask, deleteTask, getTasks, updateTask } from './api';
import { ColumnId } from './types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api client', () => {
  it('getTasks returns parsed data on success', async () => {
    const payload = { columns: [], tasks: [] };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    const result = await getTasks();

    expect(result).toEqual(payload);
    expect(fetch).toHaveBeenCalledWith('/api/tasks');
  });

  it('createTask throws when request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    await expect(createTask({ title: 'Bad', description: '', columnId: ColumnId.TODO, order: 0 })).rejects.toThrow(
      'Failed to create task',
    );
  });

  it('updateTask throws the server error message on failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Task not found' }),
    } as Response);

    await expect(updateTask('missing-id', { title: 'Nope' })).rejects.toThrow('Task not found');
  });

  it('deleteTask returns null for 204 responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 204,
    } as Response);

    const result = await deleteTask('abc123');

    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalledWith('/api/tasks/abc123', { method: 'DELETE' });
  });
});
