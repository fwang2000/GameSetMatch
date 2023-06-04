/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from '@mui/material/TextField';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Grid from '@mui/material/Grid';

interface StyledDatePickerProps {
  label:string,
  value:Date,
  onChange:(arg0:Date | null) => void,
  error?:boolean,
  disabled?:boolean,
  helperText?:any
}
function StyledDatePicker({
  label, value, onChange, error, helperText, disabled,
}:StyledDatePickerProps) {
  return (
    <Grid item xs={6}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DatePicker
          disabled={disabled}
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} error={error} helperText={helperText} />}
        />
      </LocalizationProvider>
    </Grid>
  );
}

export default StyledDatePicker;
