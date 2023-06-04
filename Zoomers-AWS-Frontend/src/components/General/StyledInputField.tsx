/* eslint-disable react/require-default-props */
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React from 'react';

interface StyledInputFieldProps {
  id:string,
  label:string,
  value:any,
  onChange:(arg0:React.ChangeEvent<HTMLInputElement>) => void,
  width?:number,
  type?:any
  required?:boolean
  endAdornment?:string,
  helperText?:string,
  error?:boolean,
  disabled?:boolean,
}

function StyledInputField({
  id, label, value, onChange, width = 12, type, required = false, endAdornment, error, helperText, disabled,
}:StyledInputFieldProps) {
  return (
    <Grid item xs={width}>
      <TextField
        fullWidth
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        color="secondary"
        type={type}
        required={required}
        error={error}
        disabled={disabled}
        helperText={helperText}
        InputProps={{
          endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
          inputProps: (type === 'number' ? { min: 1, style: { textAlign: (endAdornment ? 'right' : 'left') } } : {}),
        }}
      />
    </Grid>
  );
}

export default StyledInputField;
