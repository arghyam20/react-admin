import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { UserItem } from '@/features/users/types/user.types';
import { BlogItem } from '@/features/blogs/types/blog.types';
import { CategoryItem } from '@/features/categories/types/category.types';
import { formatDate } from './formatters';

// ==========================================
// USER EXPORTS (CSV, Excel/XLS, PDF)
// ==========================================

/**
 * Exports user list to a downloadable CSV file.
 */
export const exportUsersToCSV = (users: UserItem[], filename?: string) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `users_export_${timestamp}.csv`;

  const headers = ['#', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined Date'];

  const rows = users.map((u, index) => [
    index + 1,
    u.name,
    u.email,
    u.phone || '-',
    u.roles?.[0]?.name || 'User',
    u.status.toUpperCase(),
    formatDate(u.created_at),
  ]);

  const csvContent =
    '\uFEFF' +
    [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports user list to a native Excel spreadsheet (.xlsx / .xls).
 */
export const exportUsersToExcel = (users: UserItem[], filename?: string) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `users_export_${timestamp}.xlsx`;

  const data = users.map((u, index) => ({
    '#': index + 1,
    Name: u.name,
    Email: u.email,
    Phone: u.phone || '—',
    Role: u.roles?.[0]?.name || 'User',
    Status: u.status.toUpperCase(),
    'Joined Date': formatDate(u.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 24 },
    { wch: 30 },
    { wch: 18 },
    { wch: 14 },
    { wch: 12 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  XLSX.writeFile(workbook, actualFilename);
};

/**
 * Exports user list to a styled downloadable PDF document.
 */
export const exportUsersToPDF = (users: UserItem[], filename?: string) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `users_export_${timestamp}.pdf`;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFontSize(20);
  doc.setTextColor(24, 118, 209);
  doc.text('User Management Report', 40, 42);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated on: ${dateStr}   |   Total Users: ${users.length}`, 40, 62);

  const head = [['#', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined Date']];
  const body = users.map((u, index) => [
    index + 1,
    u.name,
    u.email,
    u.phone || '—',
    u.roles?.[0]?.name || 'User',
    u.status.charAt(0).toUpperCase() + u.status.slice(1),
    formatDate(u.created_at),
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 80,
    margin: { left: 40, right: 40 },
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 35, halign: 'center' },
      1: { cellWidth: 140, fontStyle: 'bold' },
      2: { cellWidth: 170 },
      3: { cellWidth: 105 },
      4: { cellWidth: 85 },
      5: { cellWidth: 75, halign: 'center' },
      6: { cellWidth: 110, halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        const val = String(data.cell.raw).toLowerCase();
        if (val === 'active') {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'inactive') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [217, 119, 6];
        }
      }
    },
  });

  doc.save(actualFilename);
};

// ==========================================
// BLOG EXPORTS (CSV, Excel/XLS, PDF)
// ==========================================

export const exportBlogsToExcel = (blogs: BlogItem[], filename?: string) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `blogs_export_${timestamp}.xlsx`;

  const data = blogs.map((b, index) => ({
    '#': index + 1,
    Title: b.title,
    Slug: b.slug,
    Category: b.category?.name || 'Uncategorized',
    Author: b.author?.name || 'Admin',
    Status: b.status.toUpperCase(),
    Featured: b.is_featured ? 'Yes' : 'No',
    'View Count': b.view_count || 0,
    'Published Date': b.published_at ? formatDate(b.published_at) : '—',
    'Created Date': formatDate(b.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 25 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 10 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Blogs');
  XLSX.writeFile(workbook, actualFilename);
};

export const exportBlogsToCSV = (blogs: BlogItem[], filename?: string) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `blogs_export_${timestamp}.csv`;

  const headers = ['#', 'Title', 'Slug', 'Category', 'Author', 'Status', 'Featured', 'Created Date'];
  const rows = blogs.map((b, index) => [
    index + 1,
    b.title,
    b.slug,
    b.category?.name || 'Uncategorized',
    b.author?.name || 'Admin',
    b.status.toUpperCase(),
    b.is_featured ? 'Yes' : 'No',
    formatDate(b.created_at),
  ]);

  const csvContent =
    '\uFEFF' +
    [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportBlogsToPDF = (blogs: BlogItem[], filename?: string) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `blogs_export_${timestamp}.pdf`;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFontSize(20);
  doc.setTextColor(24, 118, 209);
  doc.text('Blog Management Report', 40, 42);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated on: ${dateStr}   |   Total Articles: ${blogs.length}`, 40, 62);

  const head = [['#', 'Title', 'Category', 'Author', 'Status', 'Featured', 'Created Date']];
  const body = blogs.map((b, index) => [
    index + 1,
    b.title,
    b.category?.name || 'Uncategorized',
    b.author?.name || 'Admin',
    b.status.charAt(0).toUpperCase() + b.status.slice(1),
    b.is_featured ? 'Yes' : 'No',
    formatDate(b.created_at),
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 80,
    margin: { left: 40, right: 40 },
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(actualFilename);
};

// ==========================================
// CATEGORY EXPORTS (Excel/XLS)
// ==========================================

export const exportCategoriesToExcel = (categories: CategoryItem[], filename?: string) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `categories_export_${timestamp}.xlsx`;

  const data = categories.map((c, index) => ({
    '#': index + 1,
    Name: c.name,
    Slug: c.slug,
    'Parent Category': c.parent?.name || 'None',
    Order: c.ordering ?? 0,
    Status: c.status.toUpperCase(),
    'Created Date': formatDate(c.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 25 },
    { wch: 25 },
    { wch: 22 },
    { wch: 10 },
    { wch: 12 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
  XLSX.writeFile(workbook, actualFilename);
};
