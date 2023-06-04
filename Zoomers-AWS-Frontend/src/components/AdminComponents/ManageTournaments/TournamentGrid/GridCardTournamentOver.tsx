import React from 'react';
import { Tournament } from '../../../../interfaces/TournamentInterface';
import GridCardBase from './GridCardBase';

interface GridCardTournamentOverProps {
  tournament:Tournament
  formTournament:Tournament | undefined,
  setFormTournament:(arg0:Tournament | undefined) => void,
}

function GridCardTournamentOver({ tournament, formTournament, setFormTournament }:GridCardTournamentOverProps) {
  const openMatchHistory = () => {

  };
  return (
    <GridCardBase
      tournament={tournament}
      formTournament={formTournament}
      setFormTournament={setFormTournament}
      buttonName="View Match History"
      onButtonClick={openMatchHistory}
      enableDelete={false}
      enableEdit={false}
    />
  );
}

export default GridCardTournamentOver;
