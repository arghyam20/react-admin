import { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'error'> {
  errorMessage?: string;
}

export const FormTextField = forwardRef<HTMLInputElement, FormTextFieldProps>(
  ({ errorMessage, helperText, value, ...props }, ref) => {
    return (
      <TextField
        fullWidth
        variant="outlined"
        error={!!errorMessage}
        helperText={errorMessage || helperText}
        inputRef={ref}
        value={value ?? ''}
        {...props}
      />
    );
  }
);

FormTextField.displayName = 'FormTextField';

export default FormTextField;
