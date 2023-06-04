import React from 'react';

import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/styles';
import {
  DialogActions, Grid, Theme, useMediaQuery,
} from '@mui/material';
import Container from '@mui/material/Container';
import { AttendanceType, MatchForAdmin } from '../../../interfaces/MatchInterface';

import StyledButton from '../StyledButton';
import StyledSelect from '../StyledSelect';
import StatusModal from '../StatusModal';
import MatchService from '../../Dashboard/Calendar/MatchService';

interface MatchDetailsProps {
  match:MatchForAdmin,
  setMatch:(arg0:MatchForAdmin) => void,
  open:boolean,
  setOpen:(arg0:boolean) => void,
  isEditable:boolean,
}

const getResults = (match:MatchForAdmin) => {
  const result = match.participants[0]?.results;

  switch (result) {
    case 0:
      return 0;
    case 1:
      return match.playerOneID;
    case 2:
      return match.playerTwoID;
    default:
      return -1;
  }
};
function MatchDetails({
  match, setMatch, open, setOpen, isEditable,
}:MatchDetailsProps) {
  const theme = useTheme() as Theme;
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [playerOneAttendance, setPlayerOneAttendance] = React.useState<number>(match.participants[0]
    ? AttendanceType.indexOf(match.participants[0]?.attendance) : 0);
  const [playerTwoAttendance, setPlayerTwoAttendance] = React.useState<number>(match.participants[1]
    ? AttendanceType.indexOf(match.participants[1]?.attendance) : 0);

  const [winner, setWinner] = React.useState<number>();

  const [openStatusModal, setOpenStatusModal] = React.useState(false);
  const [statusModalText, setStatusModalText] = React.useState('');
  const [updateMatchError, setUpdateMatchError] = React.useState(false);
  //   const userID:number = useAtomValue(userIDAtom);
  const handleClickClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    setUpdateMatchError(false);

    const updateMatchResults = (res:number) => MatchService.updateMatchResults(match.playerOneID, match.matchID, res)
      .then(() => {
        const updatedMatch = match;
        updatedMatch.participants[0].results = res;
        setMatch(updatedMatch);
        return 'Updating match result sucessful';
      })
      .catch((err:Error) => `hasError ${err.message}`);

    const updateAttendance = (
      playerId:number,
      matchID:number,
      attendance:string,
      playerName:string,
    ) => MatchService.updateMatchAttendance(playerId, matchID, attendance)
      .then(() => {
        const updatedMatch = match;
        const participantIndex = playerId === match.participants[0].userID ? 0 : 1;
        updatedMatch.participants[participantIndex].attendance = attendance;
        setMatch(updatedMatch);
        return `${playerName} attendance successfully saved`;
      })
      .catch((err:Error) => `hasError ${err.message}`);

    const requestsToMake = [];
    if (winner !== getResults(match)) {
      let res:number;

      if (winner === -1 || winner === 0) {
        res = winner;
      } else {
        res = winner === match.playerOneID ? 1 : 2;
      }
      requestsToMake.push(updateMatchResults(res));
    }

    if (playerOneAttendance !== AttendanceType.indexOf(match.participants[0]?.attendance)) {
      requestsToMake.push(updateAttendance(match.playerOneID, match.matchID, AttendanceType[playerOneAttendance], match.participants[0].name));
    }

    if (playerTwoAttendance !== AttendanceType.indexOf(match.participants[1]?.attendance)) {
      requestsToMake.push(updateAttendance(match.playerTwoID, match.matchID, AttendanceType[playerTwoAttendance], match.participants[1].name));
    }

    if (requestsToMake.length === 0) {
      setStatusModalText('No changes to save.');
      setUpdateMatchError(true);
      setOpenStatusModal(true);
      return;
    }

    Promise.all(requestsToMake)
      .then((responses:string[]) => {
        setStatusModalText('');
        setUpdateMatchError(false);
        setOpenStatusModal(true);
        let hadError = false;
        const cleanedResponses = responses.map((response) => {
          if (response.includes('hasError')) {
            hadError = true;
          }
          return response.replaceAll('hasError', '');
        });
        const textForModal = cleanedResponses.reduce((s:string, currentResponse:string) => s.concat('\n', currentResponse), '');
        setStatusModalText(textForModal);
        setUpdateMatchError(hadError);
      });
  };

  const handleStatusUpdateClose = () => {
    setOpenStatusModal(false);
    if (!updateMatchError) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    setWinner(getResults(match));
    setPlayerOneAttendance(AttendanceType.indexOf(match.participants[0]?.attendance));
    setPlayerTwoAttendance(AttendanceType.indexOf(match.participants[1]?.attendance));
  }, [open]);

  const winnerOptions = [{ value: -1, text: 'Pending' },
    { value: match.playerOneID, text: `${match.participants[0]?.name}` },
    { value: match.playerTwoID, text: `${match.participants[1]?.name}` }];

  return (
    (
      <>
        <Dialog
          fullScreen={fullScreen}
          onClose={handleClickClose}
          open={open}
          style={{ color: theme.palette.primary.main, minHeight: '50vh', minWidth: '80vw' }}
        >
          <DialogContent>
            <Typography component="span" variant="h4" style={{ padding: '10px 0px 10px 0px' }}>
              {match.name}
            </Typography>
            <Container style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" style={{ padding: '10px 0px 10px 0px' }}>
                {`
              ${new Date(match.startTime).toLocaleTimeString(
                  'en-US',
                  {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  },
                )} - ${new Date(match.endTime).toLocaleTimeString(
                  'en-US',
                  { hour: '2-digit', minute: '2-digit' },
                )}`}
              </Typography>
              <Grid container spacing={2} display="flex">
                <StyledSelect
                  id="player1Attendance"
                  label={`${match.participants[0]?.name} Attending?`}
                  selectOptions={AttendanceType.map((text:string, index:number) => ({ value: index, text }))}
                  value={playerOneAttendance}
                  onChange={(e) => setPlayerOneAttendance(e.target.value)}
                  width={6}
                  disabled={isEditable}
                />
                <StyledSelect
                  id="playerTwoAttendance"
                  label={`${match.participants[1]?.name} Attending?`}
                  selectOptions={AttendanceType.map((text:string, index:number) => ({ value: index, text }))}
                  value={playerTwoAttendance}
                  onChange={(e) => setPlayerTwoAttendance(e.target.value)}
                  width={6}
                  disabled={isEditable}
                />
                <StyledSelect
                  id="results"
                  label="Winner"
                  selectOptions={winnerOptions}
                  value={winner}
                  onChange={(e) => setWinner(e.target.value)}
                  width={6}
                  disabled={isEditable}
                />
              </Grid>
            </Container>
          </DialogContent>
          <DialogActions>
            <StyledButton buttonText="Close" handleClick={handleClickClose} />
            {!isEditable && <StyledButton buttonText="Update" handleClick={handleUpdate} />}
          </DialogActions>
        </Dialog>
        <StatusModal
          open={openStatusModal}
          handleDialogClose={handleStatusUpdateClose}
          dialogTitle={`Updates were ${updateMatchError ? 'not' : ''} successful`}
          dialogText={statusModalText}
          isError={updateMatchError}
        />
      </>
    )
  );
}

export default MatchDetails;
