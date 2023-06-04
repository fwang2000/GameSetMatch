import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

interface IDetail {
  label:String,
  value:any
}

function DialogDetail({ label, value }:IDetail) {
  return (
    <Box style={{ display: 'inline-flex' }}>
      <Typography variant="body1">
        {label}
        :
      </Typography>
      <Typography variant="body1" style={{ paddingLeft: '5px' }}>
        {value}
      </Typography>
    </Box>
  );
}

export default DialogDetail;
