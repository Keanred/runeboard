import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export interface TaskCardProps {
  /** Short identifier displayed at the top of the card */
  taskId: string;
  title: string;
  description?: string;
  /** Visual variant controlling border color, opacity, and strikethrough */
  variant?: 'todo' | 'in-progress' | 'done';
  /** Called when the user clicks the "Move" button */
  onMove?: () => void;
  /** Native drag-start forwarding */
  onDragStart?: (e: React.DragEvent) => void;
}

export const TaskCard = ({ taskId, title, description, variant = 'todo', onMove, onDragStart }: TaskCardProps) => {
  const isDone = variant === 'done';

  const borderColorMap: Record<string, string> = {
    done: 'success.main',
    'in-progress': 'tertiary.main',
    todo: 'primary.main',
  };
  const borderColor = borderColorMap[variant];

  return (
    <Card
      draggable={!isDone}
      onDragStart={onDragStart}
      sx={{
        bgcolor: isDone ? 'rgba(39, 41, 53, 0.6)' : 'surface.containerHigh',
        borderLeft: '2px solid',
        borderColor,
        borderRadius: 3,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
        cursor: isDone ? 'default' : 'grab',
        opacity: isDone ? 0.7 : 1,
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'surface.bright',
        },
        '&:active': {
          cursor: isDone ? 'default' : 'grabbing',
        },
        '& .drag-indicator': {
          opacity: 0,
          transition: 'opacity 0.2s',
        },
        '&:hover .drag-indicator': {
          opacity: isDone ? 0 : 1,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'muted',
              letterSpacing: '0.15em',
              textDecoration: isDone ? 'line-through' : 'none',
            }}
          >
            {taskId}
          </Typography>
          {isDone ? (
            <CheckCircleIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
          ) : (
            <DragIndicatorIcon className="drag-indicator" sx={{ fontSize: '1rem', color: 'muted' }} />
          )}
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: isDone ? 'muted' : 'onSurface.main',
            mb: 1,
            lineHeight: 1.4,
            textDecoration: isDone ? 'line-through' : 'none',
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: isDone ? 'muted' : 'onSurface.variant',
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            {description}
          </Typography>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
          {isDone ? (
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'muted',
              }}
            >
              Archived
            </Typography>
          ) : (
            <Box
              component="button"
              onClick={onMove}
              sx={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'primary.main',
                transition: 'gap 0.2s',
                '&:hover': { gap: 1 },
              }}
            >
              Move <ArrowForwardIcon sx={{ fontSize: '0.75rem' }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
