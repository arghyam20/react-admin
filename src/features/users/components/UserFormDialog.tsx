import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, updateUserSchema, CreateUserFormData } from '../schemas/userSchema';
import { UserItem } from '../types/user.types';
import { FormTextField } from '@/components/forms/FormTextField';
import { FormSelect } from '@/components/forms/FormSelect';
import { useCreateUser, useUpdateUser, useRolesList } from '../hooks/useUsers';
import { USER_STATUSES } from '@/utils/constants';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  userToEdit?: UserItem | null;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  userToEdit,
}) => {
  const isEditing = !!userToEdit;
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { data: rolesData } = useRolesList();

  const isSubmitting = isCreating || isUpdating;
  const roles = rolesData?.data || [];

  const {
    handleSubmit,
    reset,
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      status: 'active',
      role_ids: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (userToEdit) {
        // Map user's roles to role IDs from available roles
        const initialRoleIds = (userToEdit.roles || [])
          .map((r) => {
            const match = roles.find((role) => role.slug === r.slug || role.uuid === r.uuid);
            return match ? match.id : (r as { id?: number }).id;
          })
          .filter((id): id is number => typeof id === 'number');

        reset({
          name: userToEdit.name || '',
          email: userToEdit.email || '',
          password: '',
          phone: userToEdit.phone || '',
          status: userToEdit.status || 'active',
          role_ids: initialRoleIds,
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          phone: '',
          status: 'active',
          role_ids: [],
        });
      }
    }
  }, [userToEdit, reset, open, roles]);

  const onSubmit = (data: CreateUserFormData) => {
    const payload = { ...data };
    if (isEditing && !payload.password) {
      delete (payload as { password?: string }).password;
    }

    if (isEditing && userToEdit) {
      updateUser(
        { uuid: userToEdit.uuid, input: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createUser(payload, { onSuccess: () => onClose() });
    }
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>
        {isEditing ? 'Edit User' : 'Add New User'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label="Full Name *"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label="Email Address *"
                    type="email"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label={isEditing ? 'Password (Leave empty to keep unchanged)' : 'Password *'}
                    type="password"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextField
                    label="Phone Number"
                    {...field}
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
                    label="Status *"
                    value={field.value}
                    onChange={field.onChange}
                    options={USER_STATUSES.map((s) => ({ label: s.label, value: s.value }))}
                    errorMessage={fieldState.error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {roles.length > 0 && (
              <Grid item xs={12}>
                <Controller
                  name="role_ids"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel id="roles-select-label">Assign Roles</InputLabel>
                      <Select
                        labelId="roles-select-label"
                        multiple
                        value={field.value || []}
                        onChange={field.onChange}
                        input={<OutlinedInput label="Assign Roles" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as number[]).map((val) => {
                              const roleObj = roles.find((r) => r.id === val);
                              return (
                                <Chip
                                  key={val}
                                  label={roleObj ? roleObj.name : `Role #${val}`}
                                  size="small"
                                />
                              );
                            })}
                          </Box>
                        )}
                        disabled={isSubmitting}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name} ({role.slug})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            )}
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
            {isEditing ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UserFormDialog;
