import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/styles';
import { useAtomValue } from 'jotai';
import { Theme, useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import { User } from '../OverviewGrid/MatchHistoryCard';
import MatchService from './MatchService';
import { getMatchResult, Match } from '../../../interfaces/MatchInterface';
import { userIDAtom } from '../../../atoms/userAtom';
import DialogDetail from '../../General/DialogDetail';

interface IMatchHistoryDialogProps{
  match: Match,
  participants:User[],
  matches:Match[],
  setMatches:(argo0:Match[]) => void,
  open:boolean,
  setOpen:(arg0:boolean) => void,
}

function MatchHistoryDialogue(props: IMatchHistoryDialogProps) {
  const theme = useTheme() as Theme;
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const userID:number = useAtomValue(userIDAtom);

  const {
    match, participants, matches, setMatches, open, setOpen,
  } = props;

  const handleClickClose = () => {
    setOpen(false);
  };

  const handleConfirmAttendance = () => {
    MatchService.confirmMatchAttendance(userID, match.matchID).then(() => {
      const matchToUpdate = matches.find((m:Match) => m.matchID === match.matchID);
      if (matchToUpdate) {
        const filteredMatches = matches.filter((m:Match) => m.matchID !== match.matchID);
        matchToUpdate.attendance = 'Yes';
        const updated:Match[] = [...filteredMatches,
          { ...matchToUpdate },
        ];
        setMatches(updated);
      }
      setOpen(false);
    });
  };

  const handleDropOut = () => {
    MatchService.dropOutOfMatch(userID, match.matchID).then(() => {
      const matchToUpdate = matches.find((m:Match) => m.matchID === match.matchID);
      if (matchToUpdate) {
        const filteredMatches = matches.filter((m:Match) => m.matchID !== match.matchID);
        matchToUpdate.attendance = 'No';
        const updated:Match[] = [...filteredMatches,
          { ...matchToUpdate },
        ];
        setMatches(updated);
      }
      setOpen(false);
    });
  };

  return (
    (
      <Dialog
        fullScreen={fullScreen}
        onClose={handleClickClose}
        open={open}
        style={{ color: theme.palette.primary.main }}
      >
        <DialogContent>
          <Typography variant="h4" style={{ padding: '10px 0px 10px 0px' }}>
            {match.name}
          </Typography>
          <Typography variant="h6" style={{ padding: '5px 0px 5px 0px' }}>
            {match.description}
          </Typography>
          <Container style={{ display: 'flex', flexDirection: 'column' }}>
            <DialogDetail label="Location" value={match.location} />
            <DialogDetail label="Round" value={match.roundNumber} />
            <DialogDetail
              label="Start Time"
              value={new Date(match.startTime).toLocaleTimeString(
                'en-US',
                { hour: '2-digit', minute: '2-digit' },
              )}
            />
            <DialogDetail
              label="End Time"
              value={new Date(match.endTime).toLocaleTimeString(
                'en-US',
                { hour: '2-digit', minute: '2-digit' },
              )}
            />
            <DialogDetail label="Result" value={getMatchResult(match.results)} />
            <DialogDetail label="Attendance" value={match.attendance} />
            <Typography style={{ display: 'inline-flex' }} variant="body1">Participants:</Typography>
            <div>{participants.map((participant) => <Typography variant="body1">{participant.name}</Typography>)}</div>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClickClose}>Cancel</Button>
          {+match.results === -1 && (match.attendance === 'No' || match.attendance === 'TBD')
            ? <Button color="secondary" onClick={handleConfirmAttendance}>Confirm Attendance</Button> : null}
          {+match.results === -1 && match.attendance === 'Yes'
            ? <Button color="secondary" onClick={handleDropOut}>Drop Out</Button> : null}
        </DialogActions>
      </Dialog>
    )
  );
}

export default MatchHistoryDialogue;
