import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ButtonProps } from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ModalFooter, ModalHeader, ModalSectionLabel, StaticModal } from './ModalPrimitives';
import { CreateTaskInput } from '@runeboard/schemas';
import { useState } from 'react';
import { set } from 'zod';

type Assignee = {
  name: string;
  avatarUrl?: string;
};

export type TaskInitializeModalProps = {
  open?: boolean;
  title?: string;
  subtitle?: string;
  boardName?: string;
  defaultTaskTitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  priorityOptions?: string[];
  statusOptions?: string[];
  assignees?: Assignee[];
  onClose?: () => void;
  onSubmit?: (task: CreateTaskInput) => void;
};

const defaultPriorities = ['High', 'Medium', 'Low'];
const defaultStatuses = ['To Do', 'In Progress', 'Done'];
const defaultAssignees: Assignee[] = [{ name: 'Alex' }, { name: 'Sarah' }];

const statusToColumnId: Record<string, string> = {
  'To Do': 'TODO',
  TODO: 'TODO',
  'In Progress': 'IN_PROGRESS',
  IN_PROGRESS: 'IN_PROGRESS',
  Done: 'DONE',
  DONE: 'DONE',
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const TaskInitializeModal = ({
  open = true,
  title = 'Initialize Task',
  subtitle = 'Create a new workspace entry in',
  boardName = 'Task Studio',
  defaultTaskTitle = 'Bento Grid Layout Refinement',
  confirmLabel = 'Initialize Task',
  cancelLabel = 'Cancel',
  priorityOptions = defaultPriorities,
  statusOptions = defaultStatuses,
  assignees = defaultAssignees,
  onClose,
  onSubmit,
}: TaskInitializeModalProps) => {
  const [taskTitle, setTaskTitle] = useState(defaultTaskTitle);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(priorityOptions[0] ?? '');
  const [status, setStatus] = useState(statusOptions[0] ?? '');

  const normalizeColumnId = (value: string) => {
    const normalized = value.trim().toUpperCase().replace(/\s+/g, '_');
    return statusToColumnId[value] ?? statusToColumnId[normalized] ?? normalized;
  };

  const handleConfirm = () => {
    onSubmit?.({
      title: taskTitle,
      description: description.trim().length > 0 ? description : undefined,
      columnId: normalizeColumnId(status),
      order: 0,
    });
    setTaskTitle(defaultTaskTitle);
    setDescription('');
    setPriority(priorityOptions[0] ?? '');
    setStatus(statusOptions[0] ?? '');
  };

  return (
    <StaticModal open={open} ariaLabel={title}>
      <ModalHeader
        title={title}
        titleColor="primary.main"
        subtitle={
          <>
            {subtitle}{' '}
            <Box component="span" sx={{ color: 'tertiary.main' }}>
              {boardName}
            </Box>
          </>
        }
        onClose={onClose}
      />

      <Box sx={{ p: { xs: 3, md: 5 }, maxHeight: '68vh', overflowY: 'auto' }}>
        <Stack spacing={4}>
          <Box>
            <ModalSectionLabel>Task Title</ModalSectionLabel>
            <TextField
              fullWidth
              value={taskTitle}
              placeholder="Enter task name..."
              onChange={(e) => setTaskTitle(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'surface.containerHighest',
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                },
              }}
            />
          </Box>

          <Box>
            <ModalSectionLabel>Description</ModalSectionLabel>
            <TextField
              fullWidth
              multiline
              minRows={4}
              value={description}
              placeholder="Detail the scope of work..."
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'surface.containerHighest',
                  fontSize: '0.9rem',
                },
              }}
            />
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box sx={{ flex: 1 }}>
              <ModalSectionLabel>Priority</ModalSectionLabel>
              <Stack direction="row" spacing={1}>
                {priorityOptions.map((option) => {
                  const isSelected = priority === option;
                  return (
                  <Button
                    key={option}
                    variant="outlined"
                    onClick={() => setPriority(option)}
                    sx={{
                      flex: 1,
                      borderColor: isSelected ? 'rgba(255, 180, 171, 0.45)' : 'rgba(74, 68, 81, 0.65)',
                      color: isSelected ? 'error.main' : 'onSurface.variant',
                      bgcolor: isSelected ? 'rgba(147, 0, 10, 0.2)' : 'surface.containerHighest',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    {option}
                  </Button>
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{ flex: 1 }}>
              <ModalSectionLabel>Status Column</ModalSectionLabel>
              <Select
                fullWidth
                value={status}
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
                IconComponent={ExpandMoreIcon}
                sx={{ bgcolor: 'surface.containerHighest' }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>

          <Box>
            <ModalSectionLabel>Assignees</ModalSectionLabel>
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
              <Stack direction="row" sx={{ ml: 0.6 }}>
                {assignees.map((assignee, idx) => (
                  <Avatar
                    key={assignee.name}
                    src={assignee.avatarUrl}
                    alt={assignee.name}
                    sx={{
                      width: 38,
                      height: 38,
                      ml: idx === 0 ? 0 : -1.3,
                      border: '2px solid',
                      borderColor: 'surface.containerLow',
                      bgcolor: 'surface.containerHighest',
                      color: 'onSurface.main',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {initials(assignee.name)}
                  </Avatar>
                ))}
              </Stack>

              <Button
                variant="outlined"
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  p: 0,
                  borderStyle: 'dashed',
                  borderColor: 'outline.variant',
                  color: 'onSurface.variant',
                }}
              >
                <PersonAddIcon fontSize="small" />
              </Button>

              <Typography
                sx={{ fontSize: '0.77rem', color: 'onSurface.variant', fontStyle: 'italic', fontWeight: 500 }}
              >
                {assignees.length} team member{assignees.length === 1 ? '' : 's'} assigned
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <ModalFooter cancelLabel={cancelLabel} confirmLabel={confirmLabel} onClose={onClose} onConfirm={handleConfirm} />
    </StaticModal>
  );
};

export type TaskInitializeModalTriggerProps = ButtonProps & {
  label?: string;
};

export const TaskInitializeModalTrigger = ({
  label = 'Add a task',
  sx,
  ...buttonProps
}: TaskInitializeModalTriggerProps) => (
  <Button
    fullWidth
    variant="outlined"
    startIcon={<AddIcon />}
    sx={{
      borderColor: 'rgba(68, 71, 90, 0.3)',
      color: 'muted',
      fontWeight: 600,
      py: 2,
      borderRadius: 2,
      textTransform: 'none',
      fontSize: '0.875rem',
      '&:hover': {
        bgcolor: 'rgba(189, 147, 249, 0.1)',
        borderColor: 'rgba(189, 147, 249, 0.3)',
        color: 'primary.main',
      },
      ...sx,
    }}
    {...buttonProps}
  >
    {label}
  </Button>
);
