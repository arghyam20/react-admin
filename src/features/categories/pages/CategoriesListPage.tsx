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
  Typography,
} from '@mui/material';
import {
  Add,
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  SubdirectoryArrowRight,
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusChip } from '@/components/common/StatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CategoryFormDialog } from '../components/CategoryFormDialog';
import { CategoryDetailDialog } from '../components/CategoryDetailDialog';
import { useCategoriesList, useDeleteCategory, useUpdateCategory } from '../hooks/useCategories';
import { CategoryItem } from '../types/category.types';
import { TableColumn } from '@/types/common.types';
import { formatDate } from '@/utils/formatters';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export const CategoriesListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryItem | null>(null);
  const [categoryToView, setCategoryToView] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [categoryToToggleStatus, setCategoryToToggleStatus] = useState<CategoryItem | null>(null);

  const { data, isLoading } = useCategoriesList({
    page,
    per_page: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { mutate: updateCategory, isPending: isUpdatingStatus } = useUpdateCategory();

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setCategoryToEdit(category);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.uuid, {
        onSuccess: () => setCategoryToDelete(null),
      });
    }
  };

  const handleConfirmStatusToggle = () => {
    if (categoryToToggleStatus) {
      const nextStatus = categoryToToggleStatus.status === 'active' ? 'inactive' : 'active';
      updateCategory(
        { uuid: categoryToToggleStatus.uuid, input: { status: nextStatus } },
        {
          onSettled: () => setCategoryToToggleStatus(null),
        }
      );
    }
  };

  const columns: TableColumn<CategoryItem>[] = [
    {
      id: 'name',
      label: 'Category Name',
      minWidth: 220,
      format: (_, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', pl: row.depth * 2.5 }}>
          {row.depth > 0 && (
            <SubdirectoryArrowRight sx={{ fontSize: 16, color: 'text.disabled', mr: 0.75 }} />
          )}
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              /{row.slug}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'parent',
      label: 'Parent Category',
      minWidth: 160,
      format: (_, row) => row.parent?.name || '—',
    },
    {
      id: 'ordering',
      label: 'Order',
      minWidth: 80,
      align: 'center',
      format: (val) => String(val ?? 0),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (_, row) => (
        <StatusChip
          status={row.status}
          onClick={() => setCategoryToToggleStatus(row)}
          tooltip={`Click to ${row.status === 'active' ? 'deactivate' : 'activate'} category`}
        />
      ),
    },
    {
      id: 'created_at',
      label: 'Created Date',
      minWidth: 120,
      format: (val) => formatDate(val as string),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      format: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View Details">
            <IconButton size="small" color="primary" onClick={() => setCategoryToView(row)}>
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="secondary" onClick={() => handleOpenEdit(row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setCategoryToDelete(row)}>
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
        title="Category Management"
        subtitle="Manage hierarchical categories, subcategories, and display ordering"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Add Category
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
            placeholder="Search categories by name or slug..."
            width={{ xs: '100%', sm: 320 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="category-status-filter-label">Status</InputLabel>
            <Select
              labelId="category-status-filter-label"
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
            </Select>
          </FormControl>
        </Stack>
      </PageHeader>

      <DataTable<CategoryItem>
        columns={columns}
        rows={data?.data || []}
        rowKey={(row) => row.uuid}
        totalRows={data?.meta?.total ?? 0}
        page={page}
        rowsPerPage={perPage}
        isLoading={isLoading}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        emptyTitle="No categories found"
        emptyDescription="Create your first category or adjust your search filter."
      />

      <CategoryFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        categoryToEdit={categoryToEdit}
      />

      <CategoryDetailDialog
        open={!!categoryToView}
        onClose={() => setCategoryToView(null)}
        category={categoryToView}
      />

      <ConfirmDialog
        open={!!categoryToDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? Subcategories may be affected.`}
        confirmText="Delete"
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setCategoryToDelete(null)}
      />

      <ConfirmDialog
        open={!!categoryToToggleStatus}
        title={categoryToToggleStatus?.status === 'active' ? 'Deactivate Category' : 'Activate Category'}
        message={`Are you sure you want to change status of category "${categoryToToggleStatus?.name}" to ${
          categoryToToggleStatus?.status === 'active' ? 'Inactive' : 'Active'
        }?`}
        confirmText={categoryToToggleStatus?.status === 'active' ? 'Deactivate' : 'Activate'}
        confirmColor={categoryToToggleStatus?.status === 'active' ? 'warning' : 'success'}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusToggle}
        onClose={() => setCategoryToToggleStatus(null)}
      />
    </Box>
  );
};

export default CategoriesListPage;
