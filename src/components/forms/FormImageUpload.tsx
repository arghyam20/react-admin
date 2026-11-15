import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, FormHelperText, IconButton } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { getStorageUrl } from '@/utils/formatters';

interface FormImageUploadProps {
  label: string;
  initialImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  errorMessage?: string;
  helperText?: string;
  maxSizeMb?: number;
  accept?: string;
}

export const FormImageUpload: React.FC<FormImageUploadProps> = ({
  label,
  initialImageUrl,
  onFileSelect,
  errorMessage,
  helperText = 'Supported formats: JPG, PNG, WEBP (Max 5MB)',
  maxSizeMb = 5,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(getStorageUrl(initialImageUrl));
    }
  }, [initialImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMb * 1024 * 1024) {
      setInternalError(`File size must be less than ${maxSizeMb}MB`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setInternalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label}
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            height: 180,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            bgcolor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={previewUrl}
            alt="Upload Preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed #cbd5e1',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: '#f8fafc',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'rgba(37, 99, 235, 0.04)',
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Click to upload an image
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {helperText}
          </Typography>
        </Box>
      )}

      {(errorMessage || internalError) && (
        <FormHelperText error>{internalError || errorMessage}</FormHelperText>
      )}
    </Box>
  );
};

export default FormImageUpload;
