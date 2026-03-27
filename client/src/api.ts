import type { Column, ErrorResponse, Task } from '@runeboard/schemas';

async function parseApiError(response: Response, fallback: string): Promise<Error> {
  try {
    const body = (await response.json()) as ErrorResponse;
    return new Error(body.error ?? fallback);
  } catch {
    return new Error(fallback);
  }
}

export const getTasks = async (): Promise<{ columns: Column[]; tasks: Task[] }> => {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw await parseApiError(response, 'Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw await parseApiError(response, 'Failed to create task');
  }
  return response.json();
};

export const updateTask = async (taskId: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw await parseApiError(response, 'Failed to update task');
  }
  return response.json();
};

export const deleteTask = async (taskId: string) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw await parseApiError(response, 'Failed to delete task');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const reorderTask = async (
  taskId: string,
  toIndex: number,
  toColumnId?: string,
): Promise<Task> => {
  const response = await fetch(`/api/tasks/${taskId}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toIndex, toColumnId }),
  });
  if (!response.ok) {
    throw await parseApiError(response, 'Failed to reorder task');
  }
  return response.json();
};
