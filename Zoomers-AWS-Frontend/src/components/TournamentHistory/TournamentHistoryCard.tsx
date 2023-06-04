import React from 'react';
import { useAtomValue } from 'jotai';
import PlayerStats from './PlayerStats';
import CompletedTournamentsGrid from './CompletedTournamentsGrid';
import { userIDAtom } from '../../atoms/userAtom';
import TournamentService from '../BrowseTournaments/TournamentsService';
import { TournamentRow } from '../AdminComponents/ManageTournaments/ManageTournamentsEnums';

function TournamentHistoryCard() {
  const userID = useAtomValue(userIDAtom);
  const [tournamentRows, setTournamentRows] = React.useState<TournamentRow[]>([]);
  React.useEffect(() => {
    TournamentService.getCompleted(userID)
      .then((data:TournamentRow[]) => setTournamentRows(data));
  }, []);

  return (
    <div style={{ display: 'inline-flex', width: '100%' }}>
      <div style={{ width: '80%' }}>
        <PlayerStats />
      </div>
      <div style={{ width: '30%' }}>
        <CompletedTournamentsGrid tournamentRows={tournamentRows} />
      </div>
    </div>
  );
}

export default TournamentHistoryCard;
