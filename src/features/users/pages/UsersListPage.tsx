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
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  FileDownload,
  PictureAsPdf,
  TableChart,
  DescriptionOutlined,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusChip } from '@/components/common/StatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserDetailDialog } from '../components/UserDetailDialog';
import { useUsersList, useDeleteUser, useToggleUserStatus } from '../hooks/useUsers';
import { userApi } from '../api/userApi';
import { exportUsersToCSV, exportUsersToExcel, exportUsersToPDF } from '@/utils/exportUtils';
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
  const [userToToggleStatus, setUserToToggleStatus] = useState<UserItem | null>(null);

  // Export state
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useUsersList({
    page,
    per_page: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleUserStatus();

  const handleOpenExportMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExportMenu = () => {
    setExportAnchorEl(null);
  };

  const getExportUsers = async (): Promise<UserItem[]> => {
    const total = data?.meta?.total ?? 0;
    if (!total || total <= (data?.data?.length ?? 0)) {
      return data?.data ?? [];
    }

    try {
      setIsExporting(true);
      const res = await userApi.getUsers({
        page: 1,
        per_page: Math.min(total, 1000),
        search: search || undefined,
        status: statusFilter || undefined,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      return res.data;
    } catch {
      toast.warning('Exporting currently visible users');
      return data?.data ?? [];
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    handleCloseExportMenu();
    try {
      const users = await getExportUsers();
      if (!users.length) {
        toast.warning('No user data to export');
        return;
      }
      exportUsersToExcel(users);
      toast.success(`Exported ${users.length} user${users.length === 1 ? '' : 's'} to Excel (.xlsx)`);
    } catch {
      toast.error('Failed to export Excel spreadsheet');
    }
  };

  const handleExportCSV = async () => {
    handleCloseExportMenu();
    try {
      const users = await getExportUsers();
      if (!users.length) {
        toast.warning('No user data to export');
        return;
      }
      exportUsersToCSV(users);
      toast.success(`Exported ${users.length} user${users.length === 1 ? '' : 's'} to CSV`);
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    handleCloseExportMenu();
    try {
      const users = await getExportUsers();
      if (!users.length) {
        toast.warning('No user data to export');
        return;
      }
      exportUsersToPDF(users);
      toast.success(`Exported ${users.length} user${users.length === 1 ? '' : 's'} to PDF`);
    } catch {
      toast.error('Failed to export PDF');
    }
  };

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

  const handleConfirmStatusToggle = () => {
    if (userToToggleStatus) {
      toggleStatus(userToToggleStatus.uuid, {
        onSettled: () => setUserToToggleStatus(null),
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
      format: (_, row) => {
        const role = row.roles?.[0]?.name || 'User';
        const isAdmin = role.toLowerCase().includes('admin');
        const isEditor = role.toLowerCase().includes('editor');
        return (
          <Chip
            label={role}
            size="small"
            variant="outlined"
            color={isAdmin ? 'primary' : isEditor ? 'info' : 'default'}
            sx={{
              fontWeight: 600,
              fontSize: '0.72rem',
              borderRadius: 1.5,
              textTransform: 'capitalize',
            }}
          />
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (_, row) => (
        <StatusChip
          status={row.status}
          onClick={() => setUserToToggleStatus(row)}
          tooltip={`Click to ${row.status === 'active' ? 'deactivate' : 'activate'} user`}
        />
      ),
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
      minWidth: 130,
      align: 'right',
      format: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View Details">
            <IconButton size="small" color="primary" onClick={() => setUserToView(row)}>
              <VisibilityOutlined fontSize="small" />
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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="outlined"
              color="inherit"
              startIcon={isExporting ? <CircularProgress size={16} color="inherit" /> : <FileDownload />}
              endIcon={<KeyboardArrowDown />}
              onClick={handleOpenExportMenu}
              disabled={isLoading || isExporting || !data?.data?.length}
            >
              Export
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
              Add User
            </Button>
          </Stack>
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

      <ConfirmDialog
        open={!!userToToggleStatus}
        title={userToToggleStatus?.status === 'active' ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${
          userToToggleStatus?.status === 'active' ? 'deactivate' : 'activate'
        } user "${userToToggleStatus?.name}"? ${
          userToToggleStatus?.status === 'active'
            ? 'The user will be restricted from accessing the system.'
            : 'The user will be granted active access to the system.'
        }`}
        confirmText={userToToggleStatus?.status === 'active' ? 'Deactivate' : 'Activate'}
        confirmColor={userToToggleStatus?.status === 'active' ? 'warning' : 'success'}
        isLoading={isTogglingStatus}
        onConfirm={handleConfirmStatusToggle}
        onClose={() => setUserToToggleStatus(null)}
      />

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleCloseExportMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { minWidth: 230, borderRadius: 2, boxShadow: '0 6px 24px rgba(0,0,0,0.12)' },
          },
        }}
      >
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <DescriptionOutlined fontSize="small" sx={{ color: '#16a34a' }} />
          </ListItemIcon>
          <ListItemText primary="Export as Excel" secondary="Spreadsheet (.xlsx / .xls)" />
        </MenuItem>
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <TableChart fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Export as CSV" secondary="Comma-separated values (.csv)" />
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Export as PDF" secondary="Printable document (.pdf)" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UsersListPage;
