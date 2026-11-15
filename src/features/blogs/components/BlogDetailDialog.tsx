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
  Chip,
  Paper,
} from '@mui/material';
import { Star, Visibility } from '@mui/icons-material';
import { BlogItem } from '../types/blog.types';
import { StatusChip } from '@/components/common/StatusChip';
import { formatDate, getStorageUrl } from '@/utils/formatters';

interface BlogDetailDialogProps {
  open: boolean;
  onClose: () => void;
  blog: BlogItem | null;
}

export const BlogDetailDialog: React.FC<BlogDetailDialogProps> = ({
  open,
  onClose,
  blog,
}) => {
  if (!blog) return null;

  const imageUrl = getStorageUrl(blog.featured_image);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={600}>Blog Post Preview</DialogTitle>
      <DialogContent dividers>
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={blog.title}
            sx={{
              width: '100%',
              maxHeight: 280,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 2.5,
              border: '1px solid #e2e8f0',
            }}
          />
        )}

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <StatusChip status={blog.status} />
            {blog.is_featured && (
              <Chip
                icon={<Star fontSize="small" />}
                label="Featured"
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
            {blog.category && (
              <Chip label={blog.category.name} size="small" variant="outlined" color="primary" />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto', color: 'text.secondary', fontSize: '0.8125rem' }}>
              <Visibility sx={{ fontSize: 16 }} />
              <span>{blog.view_count || 0} views</span>
            </Box>
          </Box>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            {blog.title}
          </Typography>

          <Typography variant="caption" color="text.secondary" display="block">
            By {blog.author?.name || 'Administrator'} • Created {formatDate(blog.created_at)}
          </Typography>
        </Box>

        {blog.excerpt && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#f8fafc',
              borderLeft: '4px solid #2563eb',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              {blog.excerpt}
            </Typography>
          </Paper>
        )}

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Article Content
        </Typography>
        <Box
          sx={{
            py: 1,
            color: 'text.primary',
            '& p': { mb: 1.5, lineHeight: 1.7 },
            '& h1, & h2, & h3': { my: 1.5 },
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          SEO Metadata
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary">
              SEO Title
            </Typography>
            <Typography variant="body2">{blog.seo_title || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary">
              SEO Description
            </Typography>
            <Typography variant="body2">{blog.seo_description || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary">
              Keywords
            </Typography>
            <Typography variant="body2">{blog.seo_keywords || '-'}</Typography>
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

export default BlogDetailDialog;
