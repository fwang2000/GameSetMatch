import React from 'react';

import {
  DialogActions, Button, Theme,
} from '@mui/material';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';

import ViewRegistrants from '../../../BrowseTournaments/ViewRegistrants';
import DialogDetail from '../../../General/DialogDetail';
import { FormatType, MatchingType, SeriesType } from '../ManageTournamentsEnums';
import { Tournament } from '../../../../interfaces/TournamentInterface';

interface TournamentDetailsDialogProps {
  tournament:Tournament,
  open:boolean,
  fullScreen:boolean,
  handleClose:() => void,
}
function TournamentDetailsDialog({
  open, handleClose, tournament, fullScreen,
}: TournamentDetailsDialogProps) {
  const theme = useTheme() as Theme;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      fullWidth
    >
      <DialogContent style={{ backgroundColor: theme.palette.primary.main }}>
        <Typography variant="h4" style={{ padding: '10px 0px 10px 0px' }}>
          {tournament.name}
        </Typography>
        <Typography variant="h6" style={{ padding: '5px 0px 5px 0px' }}>
          {tournament.description}
        </Typography>
        <Container style={{ display: 'flex', flexDirection: 'column' }}>
          <DialogDetail label="Location" value={tournament.location} />
          <DialogDetail label="Format" value={FormatType[tournament.format]} />
          <DialogDetail label="Match By" value={MatchingType[tournament.matchBy]} />
          <DialogDetail label="Series Type" value={SeriesType[tournament.series]} />
          <DialogDetail label="Start Date" value={new Date(tournament.startDate).toLocaleDateString('en-US')} />
          <DialogDetail label="Register by" value={new Date(tournament.closeRegistrationDate).toLocaleDateString('en-US')} />
        </Container>
        <ViewRegistrants tournamentID={tournament.tournamentID} />
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.primary.main }}>
        <Button color="secondary" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TournamentDetailsDialog;
