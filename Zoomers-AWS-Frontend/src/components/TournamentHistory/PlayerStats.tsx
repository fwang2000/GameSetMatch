import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { CChart } from '@coreui/react-chartjs';
import Typography from '@mui/material/Typography';
import { userIDAtom } from '../../atoms/userAtom';
import BadgesGrid from './BadgesGrid';
import MatchService from '../Dashboard/Calendar/MatchService';
import { Match, MatchResultTypes } from '../../interfaces/MatchInterface';
import TournamentService from '../BrowseTournaments/TournamentsService';
import { NumberQuery } from './SingleEliminationBracketMatch';

function PlayerStats() {
  const [matchWins, setMatchWins] = useState<Match[]>([]);
  const [matchLosses, setMatchLosses] = useState<Match[]>([]);
  const [matchDraws, setMatchDraws] = useState<Match[]>([]);
  const [matchPending, setMatchPending] = useState<Match[]>([]);
  const [tournamentsCompleted, setTournamentsCompleted] = useState<NumberQuery>({ next: 0 });
  const [tournamentsWon, setTournamentsWon] = useState<NumberQuery>({ next: 0 });
  const userID = useAtomValue(userIDAtom);
  useEffect(() => {
    MatchService.getPastMatches(userID).then((data:Match[]) => {
      setMatchWins(data.filter((match:Match) => match.results === MatchResultTypes.Win));
      setMatchDraws(data.filter((match:Match) => match.results === MatchResultTypes.Tie));
      setMatchLosses(data.filter((match:Match) => match.results === MatchResultTypes.Loss));
      setMatchPending(data.filter((match:Match) => match.results === MatchResultTypes.Pending));
    });
    TournamentService.getNumberOfWonTournaments(userID).then((data:NumberQuery) => { setTournamentsWon(data); });
    TournamentService.getNumberOfCompletedTournaments(userID).then((data:NumberQuery) => { setTournamentsCompleted(data); });
  }, []);

  return (
    <div>
      <Typography variant="body1" style={{ fontSize: '1.5rem', fontFamily: 'Abel', color: 'rgb(230, 230, 230)' }}>
        Tournament History
      </Typography>
      <div style={{ width: '100%', alignItems: 'center' }}>
        <BadgesGrid />
      </div>
      <Typography variant="body1" style={{ fontSize: '1.5rem', fontFamily: 'Abel', color: 'rgb(230, 230, 230)' }}>
        Tournaments Played
      </Typography>
      <div style={{ display: 'inline-flex', width: '40%', padding: '20px' }}>
        <CChart
          title="Tournaments Played"
          style={{ display: 'inline-flex', width: '100%' }}
          type="doughnut"
          data={{
            labels: ['Wins', 'Loss'],
            datasets: [
              {
                backgroundColor: ['#e6e6e6', '#61DAFB', '#27293C'],
                data: [Number(tournamentsWon.next), Number(tournamentsCompleted.next) - Number(tournamentsWon.next)],
              },
            ],
          }}
        />
      </div>
      <Typography variant="body1" style={{ fontSize: '1.5rem', fontFamily: 'Abel', color: 'rgb(230, 230, 230)' }}>
        Matches Played
      </Typography>
      <div style={{ display: 'inline-flex', width: '40%', padding: '20px' }}>
        <CChart
          title="Matches Played"
          style={{ display: 'inline-flex', width: '100%' }}
          type="doughnut"
          data={{
            labels: ['Won', 'Lost', 'Draw', 'Pending'],
            datasets: [
              {
                backgroundColor: ['#e6e6e6', '#61DAFB', '#27293C', '#cb742e'],
                data: [matchWins.length, matchLosses.length, matchDraws.length, matchPending.length],
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
export default PlayerStats;
