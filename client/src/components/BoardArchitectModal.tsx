import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ModalFooter, ModalHeader, ModalSectionLabel, StaticModal } from './ModalPrimitives';

export type BoardArchitectModalProps = {
  open?: boolean;
  title?: string;
  subtitle?: string;
  boardPlaceholder?: string;
  iconLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  teams?: string[];
  accentColors?: string[];
  selectedAccent?: string;
  onClose?: () => void;
};

const defaultTeams = ['Engineering', 'Product'];
const defaultAccentColors = ['#bd93f9', '#8be9fd', '#50fa7b', '#ff79c6', '#f1fa8c'];

export const BoardArchitectModal = ({
  open = true,
  title = 'Architect New Board',
  subtitle = 'Define the foundation of your next project.',
  boardPlaceholder = 'e.g., Q4 Marketing Campaign',
  iconLabel = 'Select Icon',
  cancelLabel = 'Cancel',
  confirmLabel = 'Initialize Board',
  teams = defaultTeams,
  accentColors = defaultAccentColors,
  selectedAccent = '#bd93f9',
  onClose,
}: BoardArchitectModalProps) => {
  return (
    <StaticModal open={open} ariaLabel={title} maxWidth={760}>
      <ModalHeader title={title} subtitle={subtitle} closeLabel="Close" onClose={onClose} />

      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={3.5}>
          <Box>
            <ModalSectionLabel>Board Identity</ModalSectionLabel>
            <TextField
              fullWidth
              placeholder={boardPlaceholder}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'surface.containerHighest',
                },
              }}
            />
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <ModalSectionLabel>Iconography</ModalSectionLabel>
              <Button
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  bgcolor: 'surface.containerHighest',
                  borderColor: 'rgba(74, 68, 81, 0.45)',
                  color: 'onSurface.main',
                  py: 1.25,
                }}
              >
                {iconLabel}
              </Button>
            </Box>

            <Box sx={{ flex: 1 }}>
              <ModalSectionLabel>Color Accent</ModalSectionLabel>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {accentColors.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: color,
                      opacity: color === selectedAccent ? 1 : 0.45,
                      outline: color === selectedAccent ? '2px solid #d7baff' : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          <Box>
            <ModalSectionLabel>Team Access</ModalSectionLabel>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
              {teams.map((team) => (
                <Box
                  key={team}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.2,
                    py: 0.7,
                    borderRadius: '999px',
                    bgcolor: 'surface.containerHighest',
                    color: 'onSurface.main',
                    border: '1px solid',
                    borderColor: 'rgba(74, 68, 81, 0.35)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                  }}
                >
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 500 }}>{team}</Typography>
                  <CloseIcon sx={{ fontSize: 14, color: 'onSurface.variant' }} />
                </Box>
              ))}
              <Button
                variant="text"
                startIcon={<AddIcon />}
                sx={{ fontSize: '0.75rem', color: 'primary.main', fontWeight: 800 }}
              >
                Add Team
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <ModalFooter cancelLabel={cancelLabel} confirmLabel={confirmLabel} onClose={onClose} />
    </StaticModal>
  );
};
