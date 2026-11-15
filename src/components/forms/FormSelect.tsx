import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
} from '@mui/material';
import { SelectOption } from '@/types/common.types';

interface FormSelectProps extends Omit<SelectProps, 'error'> {
  label: string;
  options: SelectOption[];
  errorMessage?: string;
  helperText?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  errorMessage,
  helperText,
  id,
  value,
  ...props
}) => {
  const labelId = `${id || label}-label`;

  return (
    <FormControl fullWidth size={props.size || 'small'} error={!!errorMessage}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select labelId={labelId} label={label} value={value ?? ''} {...props}>
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {(errorMessage || helperText) && (
        <FormHelperText>{errorMessage || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormSelect;
