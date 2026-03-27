import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type StaticModalProps = {
  open?: boolean;
  ariaLabel: string;
  maxWidth?: number;
  children: ReactNode;
};

export const StaticModal = ({ open = true, ariaLabel, maxWidth = 860, children }: StaticModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        bgcolor: 'rgba(11, 14, 24, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        sx={{
          width: '100%',
          maxWidth,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(74, 68, 81, 0.55)',
          bgcolor: 'surface.containerHigh',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.55)',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export type ModalSectionLabelProps = {
  children: ReactNode;
};

export const ModalSectionLabel = ({ children }: ModalSectionLabelProps) => (
  <Typography
    sx={{
      fontSize: '0.7rem',
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      fontWeight: 800,
      mb: 1.2,
    }}
  >
    {children}
  </Typography>
);

export type ModalHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  closeLabel?: string;
  titleColor?: string;
  onClose?: () => void;
};

export const ModalHeader = ({
  title,
  subtitle,
  closeLabel = 'Close',
  titleColor = 'onSurface.main',
  onClose,
}: ModalHeaderProps) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="flex-start"
    sx={{
      px: { xs: 3, md: 5 },
      py: 3,
      borderBottom: '1px solid',
      borderColor: 'rgba(74, 68, 81, 0.4)',
      bgcolor: 'surface.containerLowest',
    }}
  >
    <Box>
      <Typography variant="h4" sx={{ color: titleColor, fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' } }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography sx={{ mt: 0.6, fontSize: '0.84rem', color: 'onSurface.variant', fontWeight: 500 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
    <Button
      variant="text"
      size="small"
      startIcon={<CloseIcon />}
      sx={{ color: 'onSurface.variant', minWidth: 0, px: 1.25 }}
      onClick={onClose}
    >
      {closeLabel}
    </Button>
  </Stack>
);

export type ModalFooterProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  onClose?: () => void;
  onConfirm?: () => void;
};

export const ModalFooter = ({
  cancelLabel = 'Cancel',
  confirmLabel = 'Save',
  onClose,
  onConfirm,
}: ModalFooterProps) => (
  <Stack
    direction="row"
    justifyContent="flex-end"
    spacing={1.5}
    sx={{
      p: { xs: 3, md: 4 },
      borderTop: '1px solid',
      borderColor: 'rgba(74, 68, 81, 0.4)',
      bgcolor: 'rgba(50, 52, 64, 0.3)',
    }}
  >
    <Button sx={{ color: 'onSurface.variant', px: 2.5 }} onClick={onClose}>
      {cancelLabel}
    </Button>
    <Button
      variant="contained"
      sx={{
        background: (t) => `linear-gradient(135deg, ${t.palette.primary.light}, ${t.palette.primary.main})`,
        color: '#411478',
        fontWeight: 800,
        px: 2.7,
      }}
      onClick={onConfirm}
    >
      {confirmLabel}
    </Button>
  </Stack>
);
