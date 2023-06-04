import {
  Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import { userIDAtom } from '../../../atoms/userAtom';
import { ReactBigCalendarEvent } from '../../../interfaces/EventInterface';
import TournamentService from '../../BrowseTournaments/TournamentsService';
import AvailabilitySelector, { Availability, transformToAvailabilityString } from '../../General/Calendar/AvailabilityCalendar/AvailabilitySelector';
import LoadingOverlay from '../../General/LoadingOverlay';
import StatusModal from '../../General/StatusModal';
import StyledButton from '../../General/StyledButton';

interface UpdateAvailabilityProps {
  isOpen:boolean,
  setOpen:(arg0:boolean) => void,
  availabilities: ReactBigCalendarEvent[],
  setAvailabilities:(arg0:ReactBigCalendarEvent[]) => void,
  tournamentID:number
}

function UpdateAvailability({
  isOpen, setOpen, availabilities, setAvailabilities, tournamentID,
}: UpdateAvailabilityProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusModalText, setStatusModalText] = React.useState('');
  const userID = useAtomValue(userIDAtom);

  const handleClose = () => {
    setOpen(false);
  };

  const onUpdateAvailabilities = () => {
    setLoading(true);
    setError(false);
    const availabilityDTO:Availability[] = transformToAvailabilityString(availabilities);

    TournamentService.updateAvailabilities(tournamentID, userID, availabilityDTO)
      .then(() => {
        setStatusModalText('Availabilities updated!');
        setLoading(false);
        setStatusModalOpen(true);
      })
      .catch((err:Error) => {
        setLoading(false);
        setError(true);
        setStatusModalText(err.message);
        setStatusModalOpen(true);
      });
  };

  const handleStatusModalClose = () => {
    setStatusModalOpen(false);
    if (!error) {
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        maxWidth="xl"
        scroll="paper"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '90vh',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          <Typography component="span" variant="h5">
            Update your availability
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <AvailabilitySelector
            availabilities={availabilities}
            setAvailabilities={setAvailabilities}
          />
        </DialogContent>
        <DialogActions>
          <StyledButton buttonText="Cancel" handleClick={handleClose} size="large" />
          <StyledButton buttonText="Update" handleClick={onUpdateAvailabilities} size="large" />
        </DialogActions>
        <LoadingOverlay isOpen={loading} />
      </Dialog>
      <StatusModal
        open={statusModalOpen}
        handleDialogClose={handleStatusModalClose}
        dialogText={statusModalText}
        dialogTitle={error ? 'Error' : 'Success'}
        isError={error}
      />
    </>
  );
}

export default UpdateAvailability;
