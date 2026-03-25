import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import theme from '../theme';
import { ColumnId } from '../types';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('calls onMove when Move is clicked for non-done tasks', async () => {
    const onMove = vi.fn();

    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <TaskCard taskId="TASK-1" title="Test task" variant={ColumnId.TODO} onMove={onMove} />
      </ThemeProvider>,
    );

    await userEvent.click(getByRole('button', { name: /move/i }));

    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it('renders archived state for done tasks', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TaskCard taskId="TASK-2" title="Done task" variant={ColumnId.DONE} />
      </ThemeProvider>,
    );

    expect(getByText('Archived')).toBeInTheDocument();
  });
});
