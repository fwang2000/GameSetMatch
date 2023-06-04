export interface Tournament {
  tournamentID: number,
  name: string,
  description: string,
  startDate: Date,
  location: string,
  minParticipants: number,
  prize: string,
  format: number,
  matchBy: number,
  closeRegistrationDate: Date,
  matchDuration: number,
  series: number,
  status:number,
  adminHostsTournament:number,
  registered:boolean,
  currentRound:number,
}

export interface CurrentTournamentStatus {
  currentTournamentStatus:number
}

export const SkillLevels = ['Beginner', 'Intermediate', 'Advanced'];
