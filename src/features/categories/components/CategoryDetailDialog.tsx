import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import { CategoryItem } from '../types/category.types';
import { StatusChip } from '@/components/common/StatusChip';
import { formatDateTime, getStorageUrl } from '@/utils/formatters';

interface CategoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
  category: CategoryItem | null;
}

export const CategoryDetailDialog: React.FC<CategoryDetailDialogProps> = ({
  open,
  onClose,
  category,
}) => {
  if (!category) return null;

  const imageUrl = getStorageUrl(category.image);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>Category Details</DialogTitle>
      <DialogContent dividers>
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={category.name}
            sx={{
              width: '100%',
              maxHeight: 200,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 2.5,
              border: '1px solid #e2e8f0',
            }}
          />
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            {category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mt: 0.25 }}>
            /{category.slug}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <StatusChip status={category.status} />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Parent Category
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {category.parent?.name || 'None (Root Category)'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Display Ordering
            </Typography>
            <Typography variant="body2">{category.ordering}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Hierarchy Depth
            </Typography>
            <Typography variant="body2">Level {category.depth}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Tree Path
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {category.path || '/'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body2">
              {category.description || 'No description provided.'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body2">{formatDateTime(category.created_at)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetailDialog;
