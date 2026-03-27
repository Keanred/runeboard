import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import theme from '../theme';
import { TaskInitializeModal } from './TaskInitializeModal';

describe('TaskInitializeModal', () => {
  it('renders the static modal content by default', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={theme}>
        <TaskInitializeModal />
      </ThemeProvider>,
    );

    expect(getByRole('dialog', { name: /initialize task/i })).toBeInTheDocument();
    expect(getByText('Task Title')).toBeInTheDocument();
    expect(getByText('Assignees')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('supports reusable text props', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={theme}>
        <TaskInitializeModal
          title="Create Work Item"
          confirmLabel="Save Draft"
          cancelLabel="Dismiss"
          boardName="Project Core"
        />
      </ThemeProvider>,
    );

    expect(getByRole('dialog', { name: /create work item/i })).toBeInTheDocument();
    expect(getByText('Save Draft')).toBeInTheDocument();
    expect(getByText('Dismiss')).toBeInTheDocument();
    expect(getByText('Project Core')).toBeInTheDocument();
  });
});
