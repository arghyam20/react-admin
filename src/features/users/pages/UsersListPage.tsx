import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Typography,
} from '@mui/material';
import {
  Add,
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  ToggleOn,
  ToggleOff,
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusChip } from '@/components/common/StatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserDetailDialog } from '../components/UserDetailDialog';
import { useUsersList, useDeleteUser, useToggleUserStatus } from '../hooks/useUsers';
import { UserItem } from '../types/user.types';
import { TableColumn } from '@/types/common.types';
import { formatDate } from '@/utils/formatters';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export const UsersListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserItem | null>(null);
  const [userToView, setUserToView] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const { data, isLoading } = useUsersList({
    page,
    per_page: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: toggleStatus } = useToggleUserStatus();

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.uuid, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

  const columns: TableColumn<UserItem>[] = [
    {
      id: 'name',
      label: 'User',
      minWidth: 200,
      format: (_, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.light', fontSize: '0.875rem' }}>
            {row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 120,
      format: (val) => (val as string) || '-',
    },
    {
      id: 'roles',
      label: 'Role',
      minWidth: 120,
      format: (_, row) => row.roles?.[0]?.name || 'User',
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (val) => <StatusChip status={val as string} />,
    },
    {
      id: 'created_at',
      label: 'Joined Date',
      minWidth: 120,
      format: (val) => formatDate(val as string),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 160,
      align: 'right',
      format: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View Details">
            <IconButton size="small" color="primary" onClick={() => setUserToView(row)}>
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.status === 'active' ? 'Deactivate' : 'Activate'}>
            <IconButton
              size="small"
              color={row.status === 'active' ? 'success' : 'default'}
              onClick={() => toggleStatus(row.uuid)}
            >
              {row.status === 'active' ? <ToggleOn fontSize="small" /> : <ToggleOff fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="secondary" onClick={() => handleOpenEdit(row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setUserToDelete(row)}>
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="Manage registered administrators, editors, and platform users"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add User
          </Button>
        }
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by name, email, phone..."
            width={{ xs: '100%', sm: 320 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="user-status-filter-label">Status</InputLabel>
            <Select
              labelId="user-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </PageHeader>

      <DataTable<UserItem>
        columns={columns}
        rows={data?.data || []}
        rowKey={(row) => row.uuid}
        totalRows={data?.meta?.total ?? 0}
        page={page}
        rowsPerPage={perPage}
        isLoading={isLoading}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search criteria or add a new user."
      />

      <UserFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        userToEdit={userToEdit}
      />

      <UserDetailDialog
        open={!!userToView}
        onClose={() => setUserToView(null)}
        user={userToView}
      />

      <ConfirmDialog
        open={!!userToDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.name}"? This action will soft-delete the user record.`}
        confirmText="Delete"
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setUserToDelete(null)}
      />
    </Box>
  );
};

export default UsersListPage;
