import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset, Key } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '../schemas/changePasswordSchema';
import { FormTextField } from '@/components/forms/FormTextField';
import { useChangePassword } from '../hooks/useAuth';

export const ChangePasswordSection: React.FC = () => {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card>
      <CardHeader
        title="Security & Password"
        subheader="Ensure your account uses a secure password of at least 8 characters"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ maxWidth: 500 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FormTextField
                label="Current Password *"
                type={showCurrent ? 'text' : 'password'}
                {...register('current_password')}
                errorMessage={errors.current_password?.message}
                disabled={isPending}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Key fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowCurrent(!showCurrent)}
                        edge="end"
                      >
                        {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextField
                label="New Password *"
                type={showNew ? 'text' : 'password'}
                {...register('password')}
                errorMessage={errors.password?.message}
                disabled={isPending}
                helperText="Minimum 8 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowNew(!showNew)}
                        edge="end"
                      >
                        {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextField
                label="Confirm New Password *"
                type={showConfirm ? 'text' : 'password'}
                {...register('password_confirmation')}
                errorMessage={errors.password_confirmation?.message}
                disabled={isPending}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                      >
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block">
                After changing your password, your session remains active. Please make sure to remember your new password.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={isPending}
                startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <LockReset />}
              >
                {isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordSection;
