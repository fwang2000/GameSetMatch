import { ReactBigCalendarEvent } from '../../../../interfaces/EventInterface';
import { Match } from '../../../../interfaces/MatchInterface';

export const getFirstMatch = (matches:Match[]):Date => matches
  .sort((match1:Match, match2:Match) => match1.startTime.getTime() - match2.startTime.getTime())[0].startTime;

export const getLastMatch = (matches:Match[]):Date => matches
  .sort((match1:Match, match2:Match) => match2.endTime.getTime() - match1.endTime.getTime())[0].endTime;

export const matchToEvent = (matches:Match[]):ReactBigCalendarEvent[] => matches.map((match:Match) => ({
  id: match.matchID,
  title: match.name,
  start: new Date(match.startTime),
  end: new Date(match.endTime),
  allDay: false,
  matchStatus: match.matchStatus,
}));
