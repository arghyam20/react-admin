import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RecentBlogItem } from '../types/dashboard.types';
import { StatusChip } from '@/components/common/StatusChip';
import { formatDate } from '@/utils/formatters';

interface RecentBlogsTableProps {
  blogs: RecentBlogItem[];
}

export const RecentBlogsTable: React.FC<RecentBlogsTableProps> = ({ blogs }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Blog Posts"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        action={
          <Button component={RouterLink} to="/blogs" size="small">
            View All
          </Button>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No blog posts found
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow hover key={blog.uuid}>
                    <TableCell sx={{ fontWeight: 500, maxWidth: 220 }}>
                      {blog.title}
                    </TableCell>
                    <TableCell>{blog.category?.name || '-'}</TableCell>
                    <TableCell>
                      <StatusChip status={blog.status} />
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      {formatDate(blog.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentBlogsTable;
