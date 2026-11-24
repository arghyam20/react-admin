import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { loginSchema, LoginFormData } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const handleOpenForgotPassword = () => {
    const currentEmail = getValues('email') || '';
    setResetEmail(currentEmail);
    setResetEmailError('');
    setResetSuccess(false);
    setForgotPasswordOpen(true);
  };

  const handleSendResetLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resetEmail.trim()) {
      setResetEmailError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) {
      setResetEmailError('Please enter a valid email address');
      return;
    }

    setIsResetting(true);
    setResetEmailError('');
    try {
      await authApi.forgotPassword(resetEmail.trim());
      setResetSuccess(true);
      toast.success('Password reset instructions sent');
    } catch {
      toast.error('Failed to send reset instructions');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f1f5f9',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1.5,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              mb: 1.5,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Admin Panel
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to manage your CMS portal
          </Typography>
        </Box>

        <Card sx={{ p: 1 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                Invalid email or password. Please try again.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register('email')}
                fullWidth
                label="Email Address"
                placeholder="admin@example.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isPending}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register('password')}
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isPending}
                sx={{ mb: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={handleOpenForgotPassword}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isPending}
                sx={{ py: 1.25, fontWeight: 600, fontSize: '0.9375rem' }}
              >
                {isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={isResetting ? undefined : () => setForgotPasswordOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle fontWeight={700}>Reset Password</DialogTitle>
        <DialogContent>
          {resetSuccess ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              If an account with that email exists, password reset instructions have been sent to your inbox.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSendResetLink} noValidate sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your registered admin email address and we'll send you instructions to reset your password.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="admin@example.com"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  if (resetEmailError) setResetEmailError('');
                }}
                error={!!resetEmailError}
                helperText={resetEmailError}
                disabled={isResetting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setForgotPasswordOpen(false)}
            disabled={isResetting}
            variant="outlined"
            color="inherit"
          >
            {resetSuccess ? 'Back to Sign In' : 'Cancel'}
          </Button>
          {!resetSuccess && (
            <Button
              onClick={handleSendResetLink}
              disabled={isResetting}
              variant="contained"
              startIcon={isResetting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              Send Reset Link
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
