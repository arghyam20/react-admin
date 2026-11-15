import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { STORAGE_BASE_URL } from './constants';

dayjs.extend(relativeTime);

export const formatDate = (
  date: string | Date | null | undefined,
  format = 'MMM D, YYYY'
): string => {
  if (!date) return '-';
  const d = dayjs(date);
  return d.isValid() ? d.format(format) : '-';
};

export const formatDateTime = (
  date: string | Date | null | undefined,
  format = 'MMM D, YYYY h:mm A'
): string => {
  if (!date) return '-';
  const d = dayjs(date);
  return d.isValid() ? d.format(format) : '-';
};

export const formatRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return '-';
  const d = dayjs(date);
  return d.isValid() ? d.fromNow() : '-';
};

export const truncateText = (text: string | null | undefined, maxLength = 80): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const getStorageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.replace(/^\/?(storage\/)?/, '');
  return `${STORAGE_BASE_URL}/${cleanPath}`;
};
