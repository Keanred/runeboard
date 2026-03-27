import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import theme from '../theme';
import { BoardArchitectModal } from './BoardArchitectModal';

describe('BoardArchitectModal', () => {
  it('renders static create-board modal sections', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={theme}>
        <BoardArchitectModal />
      </ThemeProvider>,
    );

    expect(getByRole('dialog', { name: /architect new board/i })).toBeInTheDocument();
    expect(getByText('Board Identity')).toBeInTheDocument();
    expect(getByText('Iconography')).toBeInTheDocument();
    expect(getByText('Color Accent')).toBeInTheDocument();
    expect(getByText('Team Access')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Initialize Board' })).toBeInTheDocument();
  });

  it('supports reusable text and team props', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={theme}>
        <BoardArchitectModal
          title="Create Workspace"
          subtitle="Static draft modal"
          confirmLabel="Create"
          cancelLabel="Back"
          teams={['Ops', 'Design']}
        />
      </ThemeProvider>,
    );

    expect(getByRole('dialog', { name: /create workspace/i })).toBeInTheDocument();
    expect(getByText('Static draft modal')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(getByText('Back')).toBeInTheDocument();
    expect(getByText('Ops')).toBeInTheDocument();
    expect(getByText('Design')).toBeInTheDocument();
  });
});
