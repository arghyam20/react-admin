import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, CategoryFormData } from '../schemas/categorySchema';
import { CategoryItem } from '../types/category.types';
import { FormTextField } from '@/components/forms/FormTextField';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormImageUpload } from '@/components/forms/FormImageUpload';
import { useCreateCategory, useUpdateCategory, useCategoriesList } from '../hooks/useCategories';
import { CATEGORY_STATUSES } from '@/utils/constants';

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  categoryToEdit?: CategoryItem | null;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  onClose,
  categoryToEdit,
}) => {
  const isEditing = !!categoryToEdit;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { data: allCategoriesData } = useCategoriesList({ per_page: 100 });

  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
      description: '',
      status: 'active',
      ordering: 0,
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        slug: categoryToEdit.slug,
        parent_id: categoryToEdit.parent_id ?? null,
        description: categoryToEdit.description || '',
        status: categoryToEdit.status,
        ordering: categoryToEdit.ordering || 0,
      });
      setSelectedFile(null);
    } else {
      reset({
        name: '',
        slug: '',
        parent_id: null,
        description: '',
        status: 'active',
        ordering: 0,
      });
      setSelectedFile(null);
    }
  }, [categoryToEdit, reset, open]);

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      ...data,
      parent_id: data.parent_id ? Number(data.parent_id) : null,
      image: selectedFile,
    };

    if (isEditing && categoryToEdit) {
      updateCategory(
        { uuid: categoryToEdit.uuid, input: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createCategory(payload, { onSuccess: () => onClose() });
    }
  };

  // Filter out the current category from the parent dropdown to prevent self-nesting
  const parentOptions = [
    { label: 'None (Root Category)', value: '' },
    ...(allCategoriesData?.data || [])
      .filter((c) => !categoryToEdit || c.uuid !== categoryToEdit.uuid)
      .map((c) => ({
        label: `${c.depth > 0 ? '— '.repeat(c.depth) : ''}${c.name}`,
        value: c.id ?? c.uuid,
      })),
  ];

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>
        {isEditing ? 'Edit Category' : 'Add New Category'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormTextField
                label="Category Name *"
                {...register('name')}
                errorMessage={errors.name?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                label="Slug (Optional - auto-generated if left blank)"
                {...register('slug')}
                errorMessage={errors.slug?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="parent_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Parent Category"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? null : Number(val));
                    }}
                    options={parentOptions}
                    errorMessage={errors.parent_id?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Status *"
                    value={field.value}
                    onChange={field.onChange}
                    options={CATEGORY_STATUSES.map((s) => ({ label: s.label, value: s.value }))}
                    errorMessage={errors.status?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextField
                label="Display Ordering"
                type="number"
                {...register('ordering')}
                errorMessage={errors.ordering?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                label="Description"
                multiline
                rows={3}
                {...register('description')}
                errorMessage={errors.description?.message}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <FormImageUpload
                label="Category Image (Optional)"
                initialImageUrl={categoryToEdit?.image}
                onFileSelect={setSelectedFile}
              />
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
            {isEditing ? 'Save Changes' : 'Create Category'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CategoryFormDialog;
