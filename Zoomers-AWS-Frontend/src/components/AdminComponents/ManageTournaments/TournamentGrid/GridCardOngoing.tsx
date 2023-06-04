import { Typography } from '@mui/material';
import React from 'react';
import { MatchForAdmin } from '../../../../interfaces/MatchInterface';
import { initRound, Round } from '../../../../interfaces/RoundInterface';
import { CurrentTournamentStatus, Tournament } from '../../../../interfaces/TournamentInterface';
import ConfirmActionModal from '../../../General/ConfirmActionModal';
import LoadingOverlay from '../../../General/LoadingOverlay';
import StatusModal from '../../../General/StatusModal';
import { TournamentRow, TournamentStatus } from '../ManageTournamentsEnums';
import ManageTournamentService from '../ManageTournamentService';
import ReviewSchedule from '../ReviewScheduleForm/ReviewSchedule';
import GridCardBase from './GridCardBase';

interface GridCardOngoingProps {
  tournament:Tournament
  tournamentRows: TournamentRow[],
  setTournamentRows:(arg0:TournamentRow[]) => void,
  formTournament:Tournament | undefined,
  setFormTournament:(arg0:Tournament | undefined) => void,
}

interface GridCardDetailsProps {
  tournament:Tournament,
}
function GridCardDetails({ tournament }:GridCardDetailsProps) {
  return (
    <Typography variant="body2">
      {`Round #  ${tournament.currentRound}`}
    </Typography>
  );
}

function GridCardOngoing({
  tournament, tournamentRows, setTournamentRows, formTournament, setFormTournament,
}:GridCardOngoingProps) {
  const [matches, setMatches] = React.useState<MatchForAdmin[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [round, setRound] = React.useState<Round>(initRound);

  const [error, setError] = React.useState(false);
  const [statusModal, setStatusModal] = React.useState(false);
  const [statusModalText, setStatusModalText] = React.useState('');

  const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
  const [confirmationTitle, setConfirmationTitle] = React.useState('');
  const [confirmationText, setConfirmationText] = React.useState('');

  const openSchedule = () => {
    setLoading(true);
    setError(false);
    ManageTournamentService.getLatestRound(tournament.tournamentID)
      .then((latestRound:Round) => {
        setRound(latestRound);
        return ManageTournamentService.getMatchesNeedingScheduling(latestRound.roundID);
      })
      .then((data:any) => {
        setLoading(false);
        setMatches(data);
        setOpen(true);
      }).catch((err:Error) => {
        setLoading(false);
        setStatusModalText(err.message);
        setError(true);
        setStatusModal(true);
      });
  };

  const onEndCurrentRound = () => {
    setLoading(true);
    setError(false);
    ManageTournamentService.endCurrentRound(tournament.tournamentID)
      .then((response) => response.json())
      .then((data:CurrentTournamentStatus) => {
        setLoading(false);
        setStatusModalText(`Round has been ended. You can now go to ${data.currentTournamentStatus === TournamentStatus.TournamentOver
          ? "'Finished'" : "'Ready to Schedule'"}.`);
        setStatusModal(true);
      }).catch((err:Error) => {
        setLoading(false);
        setStatusModalText(err.message);
        setError(true);
        setStatusModal(true);
      });
  };

  const confirmEndRound = () => {
    setConfirmationTitle('Confirm Round Over');
    setConfirmationText('Are you sure you want end the round? All matches must have been played and results entered.');
    setConfirmationModalOpen(true);
  };

  const handleDialogClose = () => {
    setStatusModal(false);
    if (!error) {
      const updatedRows = tournamentRows.filter((t:TournamentRow) => t.id !== tournament.tournamentID);
      setTournamentRows(updatedRows);
    }
  };

  return (
    <>
      <GridCardBase
        tournament={tournament}
        formTournament={formTournament}
        setFormTournament={setFormTournament}
        buttonName="View Schedule"
        onButtonClick={openSchedule}
        buttonName2="End Round"
        onButtonClick2={confirmEndRound}
        tooltip2="End round if all matches have been played and results updated."
        enableDelete={false}
        enableEdit
        gridCardDetails={<GridCardDetails tournament={tournament} />}
      />
      <ReviewSchedule
        open={open}
        setOpen={setOpen}
        matches={matches}
        setMatches={setMatches}
        tournament={tournament}
        enableEdit={false}
        round={round}
      />
      <StatusModal
        open={statusModal}
        handleDialogClose={handleDialogClose}
        dialogText={statusModalText}
        dialogTitle={error ? 'Error' : 'Success'}
        isError={error}
      />
      <LoadingOverlay isOpen={loading} />
      <ConfirmActionModal
        open={confirmationModalOpen}
        setOpen={setConfirmationModalOpen}
        dialogText={confirmationText}
        dialogTitle={confirmationTitle}
        onConfirm={onEndCurrentRound}
      />
    </>
  );
}

export default GridCardOngoing;
