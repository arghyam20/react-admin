import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FormTextFieldProps extends Omit<TextFieldProps, 'error'> {
  errorMessage?: string;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  errorMessage,
  helperText,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      {...props}
    />
  );
};

export default FormTextField;
