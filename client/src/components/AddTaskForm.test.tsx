import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import theme from '../theme';
import { AddTaskForm } from './AddTaskForm';

describe('AddTaskForm', () => {
  it('opens form and submits title + description', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const { getByRole, getByPlaceholderText } = render(
      <ThemeProvider theme={theme}>
        <AddTaskForm onSubmit={onSubmit} />
      </ThemeProvider>,
    );

    await user.click(getByRole('button', { name: /add a task/i }));
    await user.type(getByPlaceholderText('Enter task title...'), 'Write tests');
    await user.type(getByPlaceholderText('Enter task description (optional)...'), 'Cover key paths');
    await user.click(getByRole('button', { name: 'Add' }));

    expect(onSubmit).toHaveBeenCalledWith('Write tests', 'Cover key paths');
    expect(getByRole('button', { name: /add a task/i })).toBeInTheDocument();
  });

  it('resets and closes form on cancel', async () => {
    const user = userEvent.setup();

    const { getByRole, getByPlaceholderText, queryByPlaceholderText } = render(
      <ThemeProvider theme={theme}>
        <AddTaskForm />
      </ThemeProvider>,
    );

    await user.click(getByRole('button', { name: /add a task/i }));
    await user.type(getByPlaceholderText('Enter task title...'), 'Temporary task');
    await user.click(getByRole('button', { name: 'Cancel' }));

    expect(queryByPlaceholderText('Enter task title...')).not.toBeInTheDocument();
    expect(getByRole('button', { name: /add a task/i })).toBeInTheDocument();
  });
});
