import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTask, getTasks, updateTask } from '../api';
import theme from '../theme';
import { Column, ColumnId, Task } from '../types';
import { Board } from './Board';

vi.mock('../api', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

const mockedGetTasks = vi.mocked(getTasks);
const mockedCreateTask = vi.mocked(createTask);
const mockedUpdateTask = vi.mocked(updateTask);

const columns: Column[] = [
  { id: ColumnId.TODO, title: 'To Do', order: 0 },
  { id: ColumnId.IN_PROGRESS, title: 'In Progress', order: 1 },
  { id: ColumnId.DONE, title: 'Done', order: 2 },
];

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 'task-1',
  title: 'Task title',
  description: 'Task description',
  columnId: ColumnId.TODO,
  order: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const renderBoard = () =>
  render(
    <ThemeProvider theme={theme}>
      <Board />
    </ThemeProvider>,
  );

describe('Board', () => {
  beforeEach(() => {
    mockedGetTasks.mockResolvedValue({ columns, tasks: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads board data on mount', async () => {
    mockedGetTasks.mockResolvedValue({
      columns,
      tasks: [
        makeTask({ id: 'todo-1', title: 'Todo task', columnId: ColumnId.TODO }),
        makeTask({ id: 'doing-1', title: 'Doing task', columnId: ColumnId.IN_PROGRESS }),
      ],
    });

    const view = renderBoard();

    expect(await view.findByText('Todo task')).toBeInTheDocument();
    expect(await view.findByText('Doing task')).toBeInTheDocument();
    expect(mockedGetTasks).toHaveBeenCalledTimes(1);
  });

  it('shows an error if initial board load fails', async () => {
    mockedGetTasks.mockRejectedValue(new Error('network'));

    const view = renderBoard();

    expect(await view.findByText('Failed to load tasks. Please refresh.')).toBeInTheDocument();
  });

  it('adds a task through the TODO column form', async () => {
    const user = userEvent.setup();
    mockedGetTasks.mockResolvedValue({
      columns,
      tasks: [makeTask({ id: 'todo-1', title: 'Existing todo' })],
    });

    mockedCreateTask.mockResolvedValue(
      makeTask({ id: 'todo-2', title: 'New todo from test', description: 'New description' }),
    );

    const view = renderBoard();

    expect(await view.findByText('Existing todo')).toBeInTheDocument();

    await user.click(view.getByRole('button', { name: /add a task/i }));
    await user.type(view.getByPlaceholderText('Enter task title...'), 'New todo from test');
    await user.type(view.getByPlaceholderText('Enter task description (optional)...'), 'New description');
    await user.click(view.getByRole('button', { name: 'Add' }));

    expect(await view.findByText('New todo from test')).toBeInTheDocument();

    expect(mockedCreateTask).toHaveBeenCalledWith({
      title: 'New todo from test',
      description: 'New description',
      columnId: ColumnId.TODO,
      order: 0,
    });
  });

  it('moves a task successfully and applies updated task payload', async () => {
    const user = userEvent.setup();

    mockedGetTasks.mockResolvedValue({
      columns,
      tasks: [makeTask({ id: 'todo-move-success-1', title: 'Move me success', columnId: ColumnId.TODO })],
    });

    mockedUpdateTask.mockResolvedValue(
      makeTask({
        id: 'todo-move-success-1',
        title: 'Moved to in progress',
        columnId: ColumnId.IN_PROGRESS,
      }),
    );

    const view = renderBoard();

    expect(await view.findByText('Move me success')).toBeInTheDocument();

    await user.click(view.getByRole('button', { name: /move/i }));

    expect(await view.findByText('Moved to in progress')).toBeInTheDocument();
    expect(view.queryByText('Move me success')).not.toBeInTheDocument();
    expect(mockedUpdateTask).toHaveBeenCalledWith('todo-move-success-1', { columnId: ColumnId.IN_PROGRESS });
  });

  it('refreshes board and shows error when move fails', async () => {
    const user = userEvent.setup();

    mockedGetTasks
      .mockResolvedValueOnce({
        columns,
        tasks: [makeTask({ id: 'todo-move-1', title: 'Move me', columnId: ColumnId.TODO })],
      })
      .mockResolvedValueOnce({
        columns,
        tasks: [makeTask({ id: 'todo-move-1', title: 'Move me', columnId: ColumnId.TODO })],
      });

    mockedUpdateTask.mockRejectedValue(new Error('move failed'));

    const view = renderBoard();

    expect(await view.findByText('Move me')).toBeInTheDocument();

    await user.click(view.getByRole('button', { name: /move/i }));

    expect(await view.findByText('Failed to move task. Board was refreshed; please try again.')).toBeInTheDocument();
    expect(mockedUpdateTask).toHaveBeenCalledWith('todo-move-1', { columnId: ColumnId.IN_PROGRESS });
    expect(mockedGetTasks).toHaveBeenCalledTimes(2);
  });
});
