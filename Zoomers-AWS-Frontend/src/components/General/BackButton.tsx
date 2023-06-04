import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button size="small" color="secondary" onClick={() => navigate(-1)}>Back</Button>
  );
}

export default BackButton;
