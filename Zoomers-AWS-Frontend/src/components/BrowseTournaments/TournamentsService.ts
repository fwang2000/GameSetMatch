import { Tournament } from '../../interfaces/TournamentInterface';
import SecurityService from '../../security/SecurityService';
import { TournamentStatus } from '../AdminComponents/ManageTournaments/ManageTournamentsEnums';
import { Availability } from '../General/Calendar/AvailabilityCalendar/AvailabilitySelector';
import handleErrors from '../General/ServiceHelper';

const baseURL = `${process.env.REACT_APP_API_DOMAIN}/api/tournaments`;

export interface CompletedTournament{
  tournamentID: number,
  name: string,
  description: string,
  startDate: Date,
  location: string,
  maxParticipants: number,
  prize: string,
  format: number,
  series: number,
  closeRegistrationDate: Date,
  endDate: Date,
  matchDuration: number,
  numberOfMatches: number,
  roundDuration: number,
  registered:boolean,
}

const getRegisteredTournaments = (userID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${process.env.REACT_APP_API_DOMAIN}/api/user/${userID}/registeredTournaments`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json())
  .then((data) => data.map((item: Tournament) => ({
    id: item.tournamentID,
    name: item.name,
    description: item.description,
    location: item.location,
    startDate: item.startDate,
    closeRegistrationDate: item.closeRegistrationDate,
    allTournamentDetails: item,
  })));

const getAll = (userID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}?registeredUser=${userID}&status=${TournamentStatus.OpenForRegistration}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json())
  .then((data) => data.map((item: Tournament) => ({
    id: item.tournamentID,
    name: item.name,
    description: item.description,
    location: item.location,
    startDate: new Date(item.startDate),
    closeRegistrationDate: new Date(item.closeRegistrationDate),
    allTournamentDetails: item,
  })));

export interface RegisterForTournamentBody {
  userID: number,
  availabilities: Availability[]
  skillLevel?: number;
}

const registerForTournament = (tournamentID: Number, body: RegisterForTournamentBody) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/${tournamentID}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  }))
  .then((resp) => handleErrors(resp));

const deregisterForTournament = (tournamentID: Number, userID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/${tournamentID}/deregister/${userID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })).then((resp) => handleErrors(resp));

export interface Registrant {
  userID: Number,
  name: String,
  email: String,
  skillLevel: number,
}

const getRegistrants = (tournamentID:Number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/${tournamentID}/registrants`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json());

const getCompleted = (userID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/user/${userID}/completed`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json())
  .then((data) => data.map((item: CompletedTournament) => ({
    id: item.tournamentID,
    name: item.name,
    description: item.description,
    location: item.location,
    startDate: new Date(item.startDate),
    numberOfMatches: item.numberOfMatches,
    prize: item.prize,
    allTournamentDetails: item,
  })));

const getAvailabilityForATournament = (tournamentID: Number, userID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/${tournamentID}/availabilities/${userID}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((resp) => handleErrors(resp))
  .then((response) => response.json());

const updateAvailabilities = (
  tournamentID: Number,
  userID:number,
  availabilities:Availability[],
) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/${tournamentID}/availabilities/${userID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(availabilities),
  })).then((resp) => handleErrors(resp));

// eslint-disable-next-line max-len
const getNumberOfCompletedTournaments = (userID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/user/${userID}/number/completed`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json());

const getNumberOfWonTournaments = (userID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/user/${userID}/number/won`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json());

const TournamentService = {
  getAll,
  registerForTournament,
  getRegistrants,
  getCompleted,
  getRegisteredTournaments,
  deregisterForTournament,
  getAvailabilityForATournament,
  updateAvailabilities,
  getNumberOfCompletedTournaments,
  getNumberOfWonTournaments,
};
export default TournamentService;
