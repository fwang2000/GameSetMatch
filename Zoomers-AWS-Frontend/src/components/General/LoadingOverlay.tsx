import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

interface LoadingOverlayProps {
  isOpen:boolean
}
function LoadingOverlay({ isOpen }:LoadingOverlayProps) {
  return (
    <Backdrop
      sx={{ zIndex: (theme:any) => theme.zIndex.drawer + 2 }}
      open={isOpen}
    >
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}

export default LoadingOverlay;
