import { Avatar, Box, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import { loginDataAtom } from '../../atoms/userAtom';

export default function DisplayUser() {
  const loginData = useAtomValue(loginDataAtom);
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', marginRight: 1,
    }}
    >
      <Avatar sx={{ marginRight: '10px' }} src={loginData.picture} />
      <Typography>{loginData.name}</Typography>
    </Box>
  );
}
