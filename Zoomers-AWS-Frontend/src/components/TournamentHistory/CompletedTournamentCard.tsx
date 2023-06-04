import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/styles';
import { Theme, useMediaQuery } from '@mui/material';
import { CompletedTournament } from '../BrowseTournaments/TournamentsService';
import SingleEliminationTournamentBracket from './SingleEliminationTournamentBracket';
import DoubleElimination from './DoubleEliminationTournamentBracket';
import ReactVirtualizedTable from './RoundRobinTable';
import { TournamentFormats } from '../AdminComponents/ManageTournaments/ManageTournamentsEnums';
import BracketService, { SingleBracketMatch } from './SingleEliminationBracketMatch';

interface IDetail {
  label:String,
  value:any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

interface CompletedTournamentCardProps {
  tournament:CompletedTournament,
}

function CompletedTournamentCard({ tournament }:CompletedTournamentCardProps) {
  const theme = useTheme() as Theme;
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  const [bracketMatches, setBracketMatches] = useState<SingleBracketMatch[]>([]);
  const [doubleBracketMatches, setDoubleBracketMatches] = useState<
  { upper: SingleBracketMatch[], lower: SingleBracketMatch[] } >({ upper: [], lower: [] });
  const openDetails = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchInformation() {
      if (tournament.format === TournamentFormats.DoubleKnockout) {
        const answerUpper = await BracketService.getUpperBracketTournamentMatchInfo(tournament.tournamentID);
        const answerLower = await BracketService.getLowerBracketTournamentMatchInfo(tournament.tournamentID);
        setDoubleBracketMatches({ upper: answerUpper, lower: answerLower });
      } else {
        const answer = await BracketService.getBracketTournamentMatchInfo(tournament.tournamentID);
        setBracketMatches(answer);
      }
    }
    fetchInformation();
  }, []);

  return (
    <Card style={{ width: '100%', backgroundColor: theme.palette.background.paper }}>
      <CardContent style={{ textAlign: 'left' }}>
        <Typography variant="h5">
          {tournament.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }}>
          {tournament.description}
        </Typography>
        <Typography variant="body2">
          {`Start Date: ${new Date(tournament.startDate).toLocaleDateString('en-US')}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="secondary" onClick={openDetails}>Details</Button>
      </CardActions>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        onClose={handleClose}
        PaperProps={{
          style: {
            minHeight: '90vh',
            maxHeight: '90vh',
            minWidth: '100vh',
            maxWidth: '100vh',
          },
        }}
      >
        <DialogContent style={{
          backgroundColor: theme.palette.primary.main,
        }}
        >
          <Typography variant="h4" style={{ padding: '10px 0px 10px 0px' }}>
            {tournament.name}
          </Typography>
          {tournament.format === TournamentFormats.SingleKnockout && (
          <SingleEliminationTournamentBracket
            tournament={tournament}
            bracketMatchList={bracketMatches}
          />
          )}
          {tournament.format === TournamentFormats.DoubleKnockout && (
          <DoubleElimination
            tournament={tournament}
            doubleBracketMatchList={doubleBracketMatches}
          />
          )}
          {tournament.format === TournamentFormats.RoundRobin && <ReactVirtualizedTable tournament={tournament} />}
        </DialogContent>
        <DialogActions style={{ backgroundColor: theme.palette.primary.main }}>
          <Button color="secondary" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default CompletedTournamentCard;
