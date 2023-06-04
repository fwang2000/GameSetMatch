/* eslint-disable react/require-default-props */
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
import React, { ChangeEvent } from 'react';

interface SelectProps {
  value:number,
  text:string,
}
interface StyledSelectProps {
  id:string,
  label:string,
  onChange:(arg0:ChangeEvent<any>) => void,
  selectOptions:SelectProps[],
  value:any
  width?:number,
  required?:boolean
  disabled?:boolean
}

function StyledSelect({
  id, label, onChange, selectOptions, value, width = 12, required = false, disabled,
}:StyledSelectProps) {
  return (
    <Grid item xs={width}>
      <TextField
        color="secondary"
        fullWidth
        id={id}
        select
        label={label}
        className="textField"
        value={value}
        onChange={onChange}
        SelectProps={{
          MenuProps: {
            className: 'menu',
          },
        }}
        variant="outlined"
        required={required}
        disabled={disabled}
      >
        {selectOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
}

export default StyledSelect;
