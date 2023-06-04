export interface Round {
  endDate:Date,
  roundID: number
  roundNumber: number,
  startDate: Date,
  tournamentID: number,
}

export const initRound = {
  endDate: new Date(),
  roundID: 1,
  roundNumber: 0,
  startDate: new Date(),
  tournamentID: 1,
};
