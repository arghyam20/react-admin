import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormData } from '../schemas/profileSchema';
import { FormTextField } from '@/components/forms/FormTextField';
import { FormImageUpload } from '@/components/forms/FormImageUpload';
import { useAppSelector } from '@/store';
import { useUpdateProfile } from '../hooks/useAuth';

export const EditProfileSection: React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile({
      ...data,
      avatar: avatarFile,
    });
  };

  return (
    <Card>
      <CardHeader
        title="Personal Information"
        subheader="Update your admin display name, contact email, and profile avatar"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormImageUpload
                label="Profile Avatar"
                initialImageUrl={currentUser?.avatar}
                onFileSelect={setAvatarFile}
                helperText="JPG, PNG, or WEBP (Max 2MB)"
                maxSizeMb={2}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <FormTextField
                        {...field}
                        value={field.value ?? ''}
                        label="Full Name *"
                        errorMessage={errors.name?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormTextField
                        {...field}
                        value={field.value ?? ''}
                        label="Email Address (Non-editable)"
                        type="email"
                        errorMessage={errors.email?.message}
                        disabled={true}
                        helperText="Email address cannot be changed."
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <FormTextField
                        {...field}
                        value={field.value ?? ''}
                        label="Phone Number"
                        errorMessage={errors.phone?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isPending}
                      startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <Save />}
                    >
                      {isPending ? 'Saving...' : 'Save Profile Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditProfileSection;
