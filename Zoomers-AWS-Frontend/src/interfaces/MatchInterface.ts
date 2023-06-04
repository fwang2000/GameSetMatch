export interface Match {
  results: number,
  attendance: String,
  matchID: number,
  startTime: Date,
  endTime: Date,
  roundID: number,
  roundNumber:number,
  name: String,
  location: String,
  description: String,
  matchStatus: number
}

export interface MatchHistoryRow {
  id: number,
  startTime: Date,
  endTime: Date,
  name: String,
  location: String,
  description: String,
  allMatchDetails: Match
}

export interface Participants {
  userID:number,
  name:string,
  email:string,
  results:number,
  attendance:string,
}

export interface MatchForAdmin extends Match{
  playerOneID:number,
  playerTwoID:number,
  participants: Participants[],
}

export const initMatch = {
  results: -1,
  attendance: '',
  matchID: -1,
  startTime: new Date(),
  endTime: new Date(),
  roundID: 1,
  roundNumber: 1,
  name: '',
  matchStatus: 0,
  location: '',
  description: ' ',
  playerOneID: 0,
  playerTwoID: 0,
  participants: [],
};

export const getMatchResult = (resultStatus:number) => {
  switch (resultStatus) {
    case 0:
      return 'Tie';
    case 1:
      return 'Win';
    case 2:
      return 'Loss';
    default:
      return 'Pending';
  }
};

export enum MatchStatus {
  GREAT,
  OK,
  BAD,
}

export enum MatchResultTypes {
  Tie = 0,
  Win = 1,
  Loss = 2,
  Pending = -1,
}

export const AttendanceType = ['TBD', 'No', 'Yes'];

export function setMatchDetails(item: Match):MatchHistoryRow {
  return {
    id: item.matchID,
    startTime: item.startTime,
    endTime: item.endTime,
    name: item.name,
    location: item.location,
    description: item.description,
    allMatchDetails: item,
  };
}
