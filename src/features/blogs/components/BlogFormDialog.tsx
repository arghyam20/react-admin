import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  CircularProgress,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormData } from '../schemas/blogSchema';
import { BlogItem } from '../types/blog.types';
import { FormTextField } from '@/components/forms/FormTextField';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormImageUpload } from '@/components/forms/FormImageUpload';
import { useCreateBlog, useUpdateBlog } from '../hooks/useBlogs';
import { useCategoriesList } from '@/features/categories/hooks/useCategories';
import { BLOG_STATUSES } from '@/utils/constants';

interface BlogFormDialogProps {
  open: boolean;
  onClose: () => void;
  blogToEdit?: BlogItem | null;
}

export const BlogFormDialog: React.FC<BlogFormDialogProps> = ({
  open,
  onClose,
  blogToEdit,
}) => {
  const isEditing = !!blogToEdit;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { mutate: createBlog, isPending: isCreating } = useCreateBlog();
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
  const { data: categoriesData } = useCategoriesList({ per_page: 100 });

  const isSubmitting = isCreating || isUpdating;

  const {
    handleSubmit,
    reset,
    control,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      category_id: 1,
      content: '',
      excerpt: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      status: 'draft',
      is_featured: false,
      published_at: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (blogToEdit) {
        reset({
          title: blogToEdit.title || '',
          slug: blogToEdit.slug || '',
          category_id: Number(blogToEdit.category_id) || 1,
          content: blogToEdit.content || '',
          excerpt: blogToEdit.excerpt || '',
          seo_title: blogToEdit.seo_title || '',
          seo_description: blogToEdit.seo_description || '',
          seo_keywords: blogToEdit.seo_keywords || '',
          status: blogToEdit.status || 'draft',
          is_featured: Boolean(blogToEdit.is_featured),
          published_at: blogToEdit.published_at ? blogToEdit.published_at.slice(0, 10) : '',
        });
      } else {
        const firstCatId = categoriesData?.data?.[0]?.id ?? 1;
        reset({
          title: '',
          slug: '',
          category_id: Number(firstCatId),
          content: '',
          excerpt: '',
          seo_title: '',
          seo_description: '',
          seo_keywords: '',
          status: 'draft',
          is_featured: false,
          published_at: '',
        });
      }
      setSelectedImage(null);
    }
  }, [blogToEdit, reset, open, categoriesData]);

  const onSubmit = (data: BlogFormData) => {
    const payload = {
      ...data,
      category_id: Number(data.category_id),
      featured_image: selectedImage,
    };

    if (isEditing && blogToEdit) {
      updateBlog(
        { uuid: blogToEdit.uuid, input: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createBlog(payload, { onSuccess: () => onClose() });
    }
  };

  const categoryOptions = (categoriesData?.data || []).map((c) => ({
    label: c.name,
    value: c.id ?? c.uuid,
  }));

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={600}>{isEditing ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label="Post Title *"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="slug"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label="Slug (Optional - auto-generated if left blank)"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="category_id"
                control={control}
                render={({ field, fieldState }) => (
                  <FormSelect
                    label="Category *"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    options={categoryOptions}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <FormSelect
                    label="Publication Status *"
                    value={field.value}
                    onChange={field.onChange}
                    options={BLOG_STATUSES.map((s) => ({ label: s.label, value: s.value }))}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Controller
                name="is_featured"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                        color="primary"
                      />
                    }
                    label="Featured Article (highlighted on site)"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label="Content (HTML or Text) *"
                    multiline
                    rows={8}
                    placeholder="<p>Write your blog post content here...</p>"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="excerpt"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label="Short Excerpt"
                    multiline
                    rows={2}
                    placeholder="Brief summary of the article..."
                    {...field}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormImageUpload
                label="Featured Image (Optional)"
                initialImageUrl={blogToEdit?.featured_image}
                onFileSelect={setSelectedImage}
              />
            </Grid>

            <Grid item xs={12}>
              <Accordion elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px !important' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    SEO & Meta Information (Optional)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="seo_title"
                        control={control}
                        render={({ field }) => (
                          <FormTextField
                            label="SEO Meta Title"
                            {...field}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="seo_description"
                        control={control}
                        render={({ field }) => (
                          <FormTextField
                            label="SEO Meta Description"
                            multiline
                            rows={2}
                            {...field}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="seo_keywords"
                        control={control}
                        render={({ field }) => (
                          <FormTextField
                            label="SEO Keywords (comma-separated)"
                            {...field}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isEditing ? 'Save Changes' : 'Publish Blog'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default BlogFormDialog;
