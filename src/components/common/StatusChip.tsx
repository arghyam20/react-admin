import React from 'react';
import { Chip, ChipProps, Tooltip } from '@mui/material';

interface StatusChipProps {
  status: string | null | undefined;
  size?: 'small' | 'medium';
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  clickable?: boolean;
  tooltip?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'small',
  onClick,
  clickable = Boolean(onClick),
  tooltip,
}) => {
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

  const isClickable = Boolean(onClick) || clickable;

  const chip = (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="filled"
      onClick={onClick}
      clickable={isClickable}
      sx={{
        textTransform: 'capitalize',
        fontWeight: 600,
        fontSize: '0.75rem',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        ...(isClickable && {
          '&:hover': {
            opacity: 0.9,
            transform: 'scale(1.05)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          },
        }),
      }}
    />
  );

  const tooltipTitle = tooltip ?? (onClick ? 'Click to change status' : undefined);

  if (tooltipTitle) {
    return (
      <Tooltip title={tooltipTitle} arrow placement="top">
        {chip}
      </Tooltip>
    );
  }

  return chip;
};

export default StatusChip;
