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
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthUser } from '@/features/auth/types/auth.types';
import { StatusChip } from '@/components/common/StatusChip';
import { formatDate } from '@/utils/formatters';

interface RecentUsersTableProps {
  users: AuthUser[];
}

export const RecentUsersTable: React.FC<RecentUsersTableProps> = ({ users }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Users"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        action={
          <Button component={RouterLink} to="/users" size="small">
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
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow hover key={user.uuid}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.light' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500} lineHeight={1.2}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" lineHeight={1}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.roles?.[0]?.name || 'User'}</TableCell>
                    <TableCell>
                      <StatusChip status={user.status} />
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      {formatDate(user.created_at)}
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

export default RecentUsersTable;
