import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import { BlogItem } from '../types/blog.types';
import { StatusChip } from '@/components/common/StatusChip';
import { BLOG_STATUSES } from '@/utils/constants';

interface BlogStatusDialogProps {
  open: boolean;
  blog: BlogItem | null;
  isLoading?: boolean;
  onConfirm: (newStatus: 'draft' | 'published' | 'archived') => void;
  onClose: () => void;
}

export const BlogStatusDialog: React.FC<BlogStatusDialogProps> = ({
  open,
  blog,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'draft' | 'published' | 'archived'>('draft');

  useEffect(() => {
    if (blog) {
      setSelectedStatus(blog.status);
    }
  }, [blog]);

  if (!blog) return null;

  const isCurrentStatus = selectedStatus === blog.status;

  const handleConfirm = () => {
    if (!isCurrentStatus) {
      onConfirm(selectedStatus);
    }
  };

  const getStatusDescription = (status: 'draft' | 'published' | 'archived') => {
    switch (status) {
      case 'published':
        return 'The blog post will be publicly visible to all readers.';
      case 'draft':
        return 'The post is unpublished and saved as draft (not visible publicly).';
      case 'archived':
        return 'The post will be archived and hidden from public blog listings.';
    }
  };

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={600}>Change Blog Status</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            ARTICLE
          </Typography>
          <Typography variant="body1" fontWeight={600} noWrap sx={{ mt: 0.25 }}>
            {blog.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
            <Typography variant="caption" color="text.secondary">
              Current Status:
            </Typography>
            <StatusChip status={blog.status} />
          </Box>
        </Box>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Select New Status:
        </Typography>

        <RadioGroup
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as 'draft' | 'published' | 'archived')}
        >
          <Stack spacing={1}>
            {BLOG_STATUSES.map((s) => {
              const isSelected = selectedStatus === s.value;
              return (
                <Box
                  key={s.value}
                  onClick={() => !isLoading && setSelectedStatus(s.value as 'draft' | 'published' | 'archived')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.25,
                    px: 1.75,
                    borderRadius: 2,
                    border: '1.5px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'action.selected' : 'background.paper',
                    cursor: isLoading ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: isSelected ? 'action.selected' : 'action.hover',
                    },
                  }}
                >
                  <FormControlLabel
                    value={s.value}
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2" fontWeight={isSelected ? 600 : 500}>
                        {s.label}
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                  <StatusChip status={s.value} />
                </Box>
              );
            })}
          </Stack>
        </RadioGroup>

        {!isCurrentStatus && (
          <Alert severity="info" sx={{ mt: 2, fontSize: '0.8125rem' }}>
            {getStatusDescription(selectedStatus)}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading || isCurrentStatus}
          variant="contained"
          color={selectedStatus === 'published' ? 'success' : selectedStatus === 'archived' ? 'warning' : 'primary'}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isCurrentStatus
            ? 'Select status'
            : `Change to ${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogStatusDialog;
