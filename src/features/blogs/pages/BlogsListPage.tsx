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
  Star,
  StarBorder,
  Image as ImageIcon,
  FileDownload,
  DescriptionOutlined,
  TableChart,
  PictureAsPdf,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusChip } from '@/components/common/StatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { BlogFormDialog } from '../components/BlogFormDialog';
import { BlogDetailDialog } from '../components/BlogDetailDialog';
import { BlogStatusDialog } from '../components/BlogStatusDialog';
import {
  useBlogsList,
  useDeleteBlog,
  useChangeBlogStatus,
  useToggleFeatured,
} from '../hooks/useBlogs';
import { useCategoriesList } from '@/features/categories/hooks/useCategories';
import { blogApi } from '../api/blogApi';
import { exportBlogsToCSV, exportBlogsToExcel, exportBlogsToPDF } from '@/utils/exportUtils';
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
  const [blogToChangeStatus, setBlogToChangeStatus] = useState<BlogItem | null>(null);

  // Export state
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);

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
  const { mutate: changeStatus, isPending: isChangingStatus } = useChangeBlogStatus();
  const { mutate: toggleFeatured } = useToggleFeatured();

  const handleOpenExportMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExportMenu = () => {
    setExportAnchorEl(null);
  };

  const getExportBlogs = async (): Promise<BlogItem[]> => {
    const total = data?.meta?.total ?? 0;
    if (!total || total <= (data?.data?.length ?? 0)) {
      return data?.data ?? [];
    }

    try {
      setIsExporting(true);
      const res = await blogApi.getBlogs({
        page: 1,
        per_page: Math.min(total, 1000),
        search: search || undefined,
        status: statusFilter || undefined,
        category_id: categoryFilter !== '' ? Number(categoryFilter) : undefined,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      return res.data;
    } catch {
      toast.warning('Exporting currently visible articles');
      return data?.data ?? [];
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    handleCloseExportMenu();
    try {
      const blogs = await getExportBlogs();
      if (!blogs.length) {
        toast.warning('No blog data to export');
        return;
      }
      exportBlogsToExcel(blogs);
      toast.success(`Exported ${blogs.length} article${blogs.length === 1 ? '' : 's'} to Excel (.xlsx)`);
    } catch {
      toast.error('Failed to export Excel spreadsheet');
    }
  };

  const handleExportCSV = async () => {
    handleCloseExportMenu();
    try {
      const blogs = await getExportBlogs();
      if (!blogs.length) {
        toast.warning('No blog data to export');
        return;
      }
      exportBlogsToCSV(blogs);
      toast.success(`Exported ${blogs.length} article${blogs.length === 1 ? '' : 's'} to CSV`);
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    handleCloseExportMenu();
    try {
      const blogs = await getExportBlogs();
      if (!blogs.length) {
        toast.warning('No blog data to export');
        return;
      }
      exportBlogsToPDF(blogs);
      toast.success(`Exported ${blogs.length} article${blogs.length === 1 ? '' : 's'} to PDF`);
    } catch {
      toast.error('Failed to export PDF');
    }
  };

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

  const handleConfirmStatusChange = (newStatus: 'draft' | 'published' | 'archived') => {
    if (blogToChangeStatus) {
      changeStatus(
        { uuid: blogToChangeStatus.uuid, status: newStatus },
        { onSettled: () => setBlogToChangeStatus(null) }
      );
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
      format: (_, row) => (
        <StatusChip
          status={row.status}
          onClick={() => setBlogToChangeStatus(row)}
          tooltip="Click to change status (Draft / Published / Archived)"
        />
      ),
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
      minWidth: 130,
      align: 'right',
      format: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
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
              Create Post
            </Button>
          </Stack>
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

      <BlogStatusDialog
        open={!!blogToChangeStatus}
        blog={blogToChangeStatus}
        isLoading={isChangingStatus}
        onConfirm={handleConfirmStatusChange}
        onClose={() => setBlogToChangeStatus(null)}
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

export default BlogsListPage;
