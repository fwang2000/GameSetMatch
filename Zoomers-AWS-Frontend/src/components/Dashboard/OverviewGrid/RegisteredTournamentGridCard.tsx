import React, { useEffect } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/styles';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useAtomValue } from 'jotai';
import { Tournament } from '../../../interfaces/TournamentInterface';
import { TournamentRow } from '../../BrowseTournaments/BrowseTournamentsGrid';
import TournamentDetailsDialog from '../../AdminComponents/ManageTournaments/TournamentGrid/TournamentDetailsDialog';
import LoadingOverlay from '../../General/LoadingOverlay';
import StatusModal from '../../General/StatusModal';
import { userIDAtom } from '../../../atoms/userAtom';
import { ReactBigCalendarEvent } from '../../../interfaces/EventInterface';
import UpdateAvailability from './UpdateAvailability';
import { Availability, availabilityStringToEvents } from '../../General/Calendar/AvailabilityCalendar/AvailabilitySelector';
import TournamentService from '../../BrowseTournaments/TournamentsService';

interface RegisteredTournamentGridCardProps {
  tournament:Tournament,
  tournamentRows: TournamentRow[],
  setTournamentRows: (arg0:TournamentRow[]) => void,
}

const isDeregisterDisabled = (t:Tournament):boolean => t.currentRound !== 0;

function RegisteredTournamentGridCard({ tournament, tournamentRows, setTournamentRows }:RegisteredTournamentGridCardProps) {
  const theme = useTheme() as Theme;
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const userID = useAtomValue(userIDAtom);

  const [deregisterDisabled, setDeregisterDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [statusModalText, setStatusModalText] = React.useState('');
  const [updateAvailabilityOpen, setUpdateAvailabilityOpen] = React.useState(false);
  const [availabilities, setAvailabilities] = React.useState<ReactBigCalendarEvent[]>([]);

  const onDeregister = () => {
    setLoading(true);
    setError(false);
    TournamentService.deregisterForTournament(tournament.tournamentID, userID)
      .then(() => {
        setLoading(false);
        setStatusModalText('Successfully deregistered!');
        setStatusModalOpen(true);
      })
      .catch((err:Error) => {
        setLoading(false);
        setError(false);
        setStatusModalText(err.message);
        setStatusModalOpen(true);
      });
  };

  const onUpdateAvailability = () => {
    setLoading(true);
    TournamentService.getAvailabilityForATournament(tournament.tournamentID, userID)
      .then((data:Availability[]) => {
        const availabilityEvents = availabilityStringToEvents(data);
        setAvailabilities(availabilityEvents);
        setLoading(false);
        setUpdateAvailabilityOpen(true);
      }).catch((err:Error) => {
        setLoading(false);
        setError(true);
        setStatusModalText(err.message);
        setStatusModalOpen(true);
      });
  };

  const handleStatusModalClose = () => {
    setStatusModalOpen(false);
    if (!error) {
      const thisTournament = tournamentRows.find((tRow:TournamentRow) => tRow.id === tournament.tournamentID);
      if (thisTournament) {
        const filteredTournaments = tournamentRows.filter((tRow:TournamentRow) => tRow.id !== tournament.tournamentID);
        setTournamentRows(filteredTournaments);
      }
    }
  };

  const onCloseDetails = () => {
    setOpenDetails(false);
  };

  useEffect(() => {
    setDeregisterDisabled(isDeregisterDisabled(tournament));
  }, []);

  return (
    <Paper style={{ width: '100%', backgroundColor: theme.palette.background.paper }}>
      <Grid
        container
        sx={{
          px: 2, py: 2, display: 'flex', flexDirection: 'row', width: '100%',
        }}
      >
        <Grid item style={{ textAlign: 'left' }}>
          <Typography variant="h6">
            {tournament.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            {tournament.description}
          </Typography>
          <Button size="small" color="secondary" onClick={(() => setOpenDetails(true))}>Details</Button>
        </Grid>
        <Grid container style={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Button size="small" color="secondary" onClick={onUpdateAvailability}>Update Availability</Button>
          </Grid>
          <Grid item>
            <Tooltip title={deregisterDisabled ? 'To drop out, click drop out on the next match for this tournament' : ''}>
              <span>
                <Button size="small" color="secondary" disabled={deregisterDisabled} onClick={onDeregister}>Deregister</Button>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <TournamentDetailsDialog open={openDetails} handleClose={onCloseDetails} tournament={tournament} fullScreen={fullScreen} />
      <UpdateAvailability
        isOpen={updateAvailabilityOpen}
        setOpen={setUpdateAvailabilityOpen}
        availabilities={availabilities}
        setAvailabilities={setAvailabilities}
        tournamentID={tournament.tournamentID}
      />
      <StatusModal
        open={statusModalOpen}
        handleDialogClose={handleStatusModalClose}
        dialogText={statusModalText}
        dialogTitle={error ? 'Error' : 'Success'}
        isError={error}
      />
      <LoadingOverlay isOpen={loading} />
    </Paper>
  );
}

export default RegisteredTournamentGridCard;
