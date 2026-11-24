import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import { TableColumn } from '@/types/common.types';
import { EmptyState } from './EmptyState';
import { PAGE_SIZE_OPTIONS } from '@/utils/constants';

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  totalRows: number;
  page: number; // 0-based for MUI TablePagination, or 1-based converted internally
  rowsPerPage: number;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  totalRows,
  page,
  rowsPerPage,
  isLoading = false,
  onPageChange,
  onRowsPerPageChange,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>): React.ReactElement {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage + 1); // convert to 1-based page for backend
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(1);
  };

  const muiPage = Math.max(0, page - 1);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      {isLoading && <LinearProgress sx={{ height: 3, bgcolor: '#f1f5f9' }} />}
      <TableContainer sx={{ maxHeight: 680 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#475569',
                    bgcolor: '#f8fafc',
                    borderBottom: '1.5px solid #e2e8f0',
                    py: 1.75,
                    px: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && rows.length === 0 ? (
              Array.from({ length: Math.min(rowsPerPage, 6) }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={col.id} align={col.align || 'left'} sx={{ py: 2, px: 2 }}>
                      <Skeleton
                        animation="wave"
                        height={22}
                        width={colIndex === 0 ? '75%' : colIndex === 1 ? '55%' : '40%'}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ borderBottom: 'none', py: 4 }}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  hover
                  key={rowKey(row)}
                  sx={{
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                      bgcolor: '#f8fafc !important',
                    },
                    '&:last-child td': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  {columns.map((column) => {
                    const value = (row as Record<string, unknown>)[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{
                          py: 1.75,
                          px: 2,
                          borderBottom: '1px solid #f1f5f9',
                          fontSize: '0.875rem',
                          color: '#1e293b',
                        }}
                      >
                        {column.format ? column.format(value, row) : (value as React.ReactNode) ?? '—'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={muiPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          color: 'text.secondary',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: '0.8125rem',
            fontWeight: 500,
          },
          '.MuiTablePagination-select': {
            fontSize: '0.8125rem',
            fontWeight: 600,
          },
        }}
      />
    </Paper>
  );
}

export default DataTable;
