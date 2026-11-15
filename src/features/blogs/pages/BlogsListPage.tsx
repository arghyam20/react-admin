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
  Avatar,
  Chip,
} from '@mui/material';
import {
  Add,
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  Star,
  StarBorder,
  Publish,
  Unpublished,
  Image as ImageIcon,
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusChip } from '@/components/common/StatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { BlogFormDialog } from '../components/BlogFormDialog';
import { BlogDetailDialog } from '../components/BlogDetailDialog';
import {
  useBlogsList,
  useDeleteBlog,
  usePublishBlog,
  useToggleFeatured,
} from '../hooks/useBlogs';
import { useCategoriesList } from '@/features/categories/hooks/useCategories';
import { BlogItem } from '../types/blog.types';
import { TableColumn } from '@/types/common.types';
import { formatDate, getStorageUrl } from '@/utils/formatters';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export const BlogsListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<BlogItem | null>(null);
  const [blogToView, setBlogToView] = useState<BlogItem | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);

  const { data, isLoading } = useBlogsList({
    page,
    per_page: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
    category_id: categoryFilter !== '' ? Number(categoryFilter) : undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { data: categoriesData } = useCategoriesList({ per_page: 100 });
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();
  const { mutate: changePublishStatus } = usePublishBlog();
  const { mutate: toggleFeatured } = useToggleFeatured();

  const handleOpenCreate = () => {
    setBlogToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (blog: BlogItem) => {
    setBlogToEdit(blog);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      deleteBlog(blogToDelete.uuid, {
        onSuccess: () => setBlogToDelete(null),
      });
    }
  };

  const columns: TableColumn<BlogItem>[] = [
    {
      id: 'title',
      label: 'Article',
      minWidth: 260,
      format: (_, row) => {
        const imageUrl = getStorageUrl(row.featured_image);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              variant="rounded"
              src={imageUrl || undefined}
              sx={{ width: 44, height: 44, bgcolor: '#f1f5f9', color: 'text.secondary' }}
            >
              <ImageIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {row.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                /{row.slug}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 140,
      format: (_, row) => (
        <Chip
          label={row.category?.name || 'Uncategorized'}
          size="small"
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'author',
      label: 'Author',
      minWidth: 130,
      format: (_, row) => row.author?.name || 'Admin',
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (val) => <StatusChip status={val as string} />,
    },
    {
      id: 'is_featured',
      label: 'Featured',
      minWidth: 90,
      align: 'center',
      format: (val, row) => (
        <Tooltip title={val ? 'Remove from Featured' : 'Mark as Featured'}>
          <IconButton size="small" onClick={() => toggleFeatured(row.uuid)}>
            {val ? <Star sx={{ color: '#eab308' }} /> : <StarBorder sx={{ color: 'text.disabled' }} />}
          </IconButton>
        </Tooltip>
      ),
    },
    {
      id: 'created_at',
      label: 'Date',
      minWidth: 110,
      format: (val) => formatDate(val as string),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 170,
      align: 'right',
      format: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title={row.status === 'published' ? 'Unpublish' : 'Publish'}>
            <IconButton
              size="small"
              color={row.status === 'published' ? 'warning' : 'success'}
              onClick={() => changePublishStatus({ uuid: row.uuid, publish: row.status !== 'published' })}
            >
              {row.status === 'published' ? <Unpublished fontSize="small" /> : <Publish fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Preview">
            <IconButton size="small" color="primary" onClick={() => setBlogToView(row)}>
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="secondary" onClick={() => handleOpenEdit(row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setBlogToDelete(row)}>
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
        title="Blog Management"
        subtitle="Create, edit, organize, and publish rich blog articles"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Create Post
          </Button>
        }
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search articles by title, excerpt..."
            width={{ xs: '100%', sm: 300 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              label="Category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as number | '');
                setPage(1);
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {(categoriesData?.data || []).map((cat) => (
                <MenuItem key={cat.id ?? cat.uuid} value={cat.id ?? cat.uuid}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="blog-status-filter-label">Status</InputLabel>
            <Select
              labelId="blog-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </PageHeader>

      <DataTable<BlogItem>
        columns={columns}
        rows={data?.data || []}
        rowKey={(row) => row.uuid}
        totalRows={data?.meta?.total ?? 0}
        page={page}
        rowsPerPage={perPage}
        isLoading={isLoading}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        emptyTitle="No blog posts found"
        emptyDescription="Create your first blog post or adjust your search filter."
      />

      <BlogFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        blogToEdit={blogToEdit}
      />

      <BlogDetailDialog
        open={!!blogToView}
        onClose={() => setBlogToView(null)}
        blog={blogToView}
      />

      <ConfirmDialog
        open={!!blogToDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setBlogToDelete(null)}
      />
    </Box>
  );
};

export default BlogsListPage;
