import Typography from '@mui/material/Typography';
import React from 'react';
import { Tournament } from '../../../../interfaces/TournamentInterface';
import LoadingOverlay from '../../../General/LoadingOverlay';
import StatusModal from '../../../General/StatusModal';
import { TournamentRow } from '../ManageTournamentsEnums';
import ManageTournamentService from '../ManageTournamentService';
import GridCardBase from './GridCardBase';

interface GridCardOpenForRegistrationProps {
  tournament:Tournament
  tournamentRows: TournamentRow[],
  setTournamentRows:(arg0:TournamentRow[]) => void,
  formTournament:Tournament | undefined,
  setFormTournament:(arg0:Tournament | undefined) => void,
}

interface GridCardDetailsProps {
  tournament:Tournament
}
function GridCardDetails({ tournament }:GridCardDetailsProps) {
  return (
    <>
      <Typography variant="body2">
        {`Start Date: ${new Date(tournament.startDate).toLocaleDateString('en-US')}`}
      </Typography>
      <Typography variant="body2">
        {`Registration Closing Date: ${new Date(tournament.closeRegistrationDate).toLocaleDateString('en-US')}`}
      </Typography>
    </>
  );
}

function GridCardOpenForRegistration({
  tournament, tournamentRows, setTournamentRows, formTournament, setFormTournament,
}:GridCardOpenForRegistrationProps) {
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleDialogClose = () => {
    setStatusModalOpen(false);
    if (!error) {
      const updatedRows = tournamentRows.filter((t:TournamentRow) => t.id !== tournament.tournamentID);
      setTournamentRows(updatedRows);
    }
  };

  const closeRegistration = () => {
    setLoading(true);
    setError(false);
    setErrorMessage('');
    ManageTournamentService.closeRegistration(tournament.tournamentID).then(() => {
      setLoading(false);
      setStatusModalOpen(true);
    }).catch((err:Error) => {
      setLoading(false);
      setError(true);
      setErrorMessage(err.message);
      setStatusModalOpen(true);
    });
  };
  return (
    <>
      <GridCardBase
        tournament={tournament}
        formTournament={formTournament}
        setFormTournament={setFormTournament}
        buttonName="Close Registration"
        onButtonClick={closeRegistration}
        enableDelete
        enableEdit
        gridCardDetails={<GridCardDetails tournament={tournament} />}
        tournamentRows={tournamentRows}
        setTournamentRows={setTournamentRows}
      />
      <StatusModal
        open={statusModalOpen}
        handleDialogClose={handleDialogClose}
        dialogText={error ? errorMessage
          : "Tournament registration closed. Go to the 'Ready to Schedule' to continue."}
        dialogTitle={error ? 'Error' : 'Success'}
        isError={error}
      />
      <LoadingOverlay isOpen={loading} />
    </>
  );
}

export default GridCardOpenForRegistration;
