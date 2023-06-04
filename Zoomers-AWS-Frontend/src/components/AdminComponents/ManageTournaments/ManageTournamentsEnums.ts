import { Tournament } from '../../../interfaces/TournamentInterface';

export enum TabNames {
  OpenForRegistration,
  ManageSchedule,
  Ongoing,
  Over,
}

export enum GridCardTypes {
  ManageSchedule,
  Ongoing,
  OpenForRegistration,
  Over,
}

export enum TournamentStatus {
  Default,
  OpenForRegistration,
  ReadyToSchedule,
  ReadyToPublishSchedule,
  Ongoing,
  ReadyToPublishNextRound,
  FinalRound,
  TournamentOver,
}

export enum TournamentFormats {
  RoundRobin,
  SingleKnockout,
  DoubleKnockout,
  SingleBracket,
}

export const FormatType = ['Round-Robin', 'Single-knockout', 'Double-knockout', 'Single-bracket'];

export const MatchingType = ['Randomly', 'By Skill', 'Seed'];

export const SeriesType = ['Best of 1', 'Best of 3', 'Best of 5', 'Best of 7'];

export interface TournamentRow {
  id: Number,
  name: String,
  description: String,
  location: String,
  startDate: Date,
  closeRegistrationDate: Date,
  allTournamentDetails: Tournament
}
