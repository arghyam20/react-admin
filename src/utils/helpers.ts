import { AxiosError } from 'axios';

interface LaravelErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]> | string[];
}

export const getErrorMessage = (error: unknown, fallback = 'An unexpected error occurred'): string => {
  if (!error) return fallback;

  if (typeof error === 'string') return error;

  if (error instanceof AxiosError) {
    const data = error.response?.data as LaravelErrorResponse | undefined;

    if (data?.errors) {
      if (typeof data.errors === 'object' && !Array.isArray(data.errors)) {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey && data.errors[firstKey]?.length) {
          return data.errors[firstKey][0];
        }
      } else if (Array.isArray(data.errors) && data.errors.length > 0) {
        return String(data.errors[0]);
      }
    }

    if (data?.message) {
      return data.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const getFieldErrors = (error: unknown): Record<string, string> => {
  const result: Record<string, string> = {};
  if (error instanceof AxiosError) {
    const data = error.response?.data as LaravelErrorResponse | undefined;
    if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      Object.entries(data.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          result[field] = messages[0];
        }
      });
    }
  }
  return result;
};

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
