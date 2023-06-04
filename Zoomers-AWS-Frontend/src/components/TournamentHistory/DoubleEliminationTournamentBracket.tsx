/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import { DoubleEliminationBracket, SVGViewer, Match } from '@g-loot/react-tournament-brackets';
import React, { useEffect, useState } from 'react';
import { CompletedTournament } from '../BrowseTournaments/TournamentsService';
import BracketService, { SingleBracketMatch } from './SingleEliminationBracketMatch';

interface CompletedTournamentCardPropsDoubleElimination {
  tournament:CompletedTournament,
  doubleBracketMatchList:{
    upper: SingleBracketMatch[],
    lower: SingleBracketMatch[] }
}

export default function DoubleElimination({ tournament, doubleBracketMatchList }: CompletedTournamentCardPropsDoubleElimination) {
  return (
    <DoubleEliminationBracket
      matches={doubleBracketMatchList}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <SVGViewer width={650} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );
}
