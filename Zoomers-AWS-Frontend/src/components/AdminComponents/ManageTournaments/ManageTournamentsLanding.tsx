import React from 'react';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useAtomValue } from 'jotai';

import Container from '@mui/material/Container';
import { loginDataAtom } from '../../../atoms/userAtom';
import ManageTournaments from './ManageTournaments';

function ManageTournamentsLanding() {
  const userData = useAtomValue(loginDataAtom);

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 2 }}>
        { userData.isAdmin >= 1 ? <ManageTournaments />
          : <Typography>You are unauthorized to view this page.</Typography>}
      </Paper>
    </Container>
  );
}

export default ManageTournamentsLanding;
