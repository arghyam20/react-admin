import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  status: string | null | undefined;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let color: ChipProps['color'] = 'default';
  let label = status;

  switch (normalized) {
    case 'active':
    case 'published':
      color = 'success';
      label = normalized === 'active' ? 'Active' : 'Published';
      break;
    case 'inactive':
    case 'archived':
      color = 'error';
      label = normalized === 'inactive' ? 'Inactive' : 'Archived';
      break;
    case 'pending':
    case 'draft':
      color = 'warning';
      label = normalized === 'pending' ? 'Pending' : 'Draft';
      break;
    default:
      color = 'default';
      label = status;
  }

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="filled"
      sx={{
        textTransform: 'capitalize',
        fontWeight: 600,
        fontSize: '0.75rem',
      }}
    />
  );
};

export default StatusChip;
