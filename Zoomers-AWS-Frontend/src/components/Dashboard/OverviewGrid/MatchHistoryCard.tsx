import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/styles';
import {
  FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
  Theme, useMediaQuery,
} from '@mui/material';
import Container from '@mui/material/Container';
import { useAtomValue } from 'jotai';
import { userIDAtom } from '../../../atoms/userAtom';
import { getMatchResult, Match } from '../../../interfaces/MatchInterface';
import MatchService from '../Calendar/MatchService';

export interface User {
  userID: number,
  firebaseID: String,
  name: String,
  email: String,
  is_admin: number,
}

// TODO: Lift this interface into the general component section
interface IDetail {
  label:String,
  value:String
}

// TODO: Lift this function into the general component section
function Detail({ label, value }:IDetail) {
  return (
    <div style={{ display: 'inline-flex' }}>
      <Typography variant="body1">
        {label}
        :
      </Typography>
      <Typography variant="body1" style={{ paddingLeft: '5px' }}>
        {value}
      </Typography>
    </div>
  );
}

function MatchHistoryCard(props: any) {
  const theme = useTheme() as Theme;
  const userID = useAtomValue(userIDAtom);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { match, matches, setMatches } = props;
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [result, setResult] = useState(match.result);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenUpdate = () => {
    setUpdateOpen(true);
  };

  const handleCloseUpdateResults = () => {
    setUpdateOpen(false);
  };

  const handleUpdateMatchResults = () => {
    MatchService.updateMatchResults(userID, match.matchID, result).then(() => {
      match.results = result;
    }).then(() => {
      const matchToUpdate = matches.find((m:Match) => m.matchID === match.matchID);
      if (matchToUpdate) {
        const filteredMatches = matches.filter((m:Match) => m.matchID !== match.matchID);
        matchToUpdate.results = result;
        const updated:Match[] = [...filteredMatches,
          { ...matchToUpdate },
        ];
        setMatches(updated);
      }
    });
  };

  const handleResultChange = (event:SelectChangeEvent) => {
    setResult(event.target.value as string);
  };

  return (
    <Card style={{ width: '100%', backgroundColor: theme.palette.background.paper }}>
      <CardContent style={{ textAlign: 'left' }}>
        <Typography variant="h6">
          {match.name}
        </Typography>
        <Typography variant="body2">
          {match.description}
        </Typography>
        <Typography variant="body2">
          {`Date: ${new Date(match.startTime).toLocaleDateString('en-US')}`}
        </Typography>
        <Typography variant="body2">
          {`Time: ${new Date(match.startTime).toLocaleTimeString(
            'en-US',
            { hour: '2-digit', minute: '2-digit' },
          )}`}
        </Typography>
        <Typography variant="body2">
          {`Result: ${getMatchResult(match.results)}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="secondary" onClick={handleClickOpen}>Details</Button>
        {+match.results === -1 && match.attendance === 'Yes'
          ? <Button size="small" color="secondary" onClick={handleOpenUpdate}>Update Results</Button> : null}
      </CardActions>
      <Dialog
        fullScreen={fullScreen}
        onClose={handleClose}
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
            <Detail label="Location" value={match.location} />
            <Detail label="Round" value={match.type} />
            <Detail
              label="Date"
              value={new Date(match.startTime).toLocaleDateString(
                'en-US',
                { hour: '2-digit', minute: '2-digit' },
              )}
            />
            <Detail
              label="Start Time"
              value={new Date(match.startTime).toLocaleTimeString(
                'en-US',
                { hour: '2-digit', minute: '2-digit' },
              )}
            />
            <Detail
              label="End Time"
              value={new Date(match.endTime).toLocaleTimeString(
                'en-US',
                { hour: '2-digit', minute: '2-digit' },
              )}
            />
            <Detail label="Result" value={getMatchResult(match.results)} />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        onClose={handleClose}
        open={updateOpen}
        style={{ color: theme.palette.primary.main, minHeight: '30vh', minWidth: '30vh' }}
      >
        <DialogContent>
          <Typography sx={{ pb: 2 }}>Upate the results:</Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Result</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={result}
              onChange={handleResultChange}
            >
              <MenuItem value={1}>Win</MenuItem>
              <MenuItem value={2}>Loss</MenuItem>
              <MenuItem value={-1}>Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseUpdateResults}>Cancel</Button>
          <Button color="secondary" onClick={handleUpdateMatchResults}>Update</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
export default MatchHistoryCard;
