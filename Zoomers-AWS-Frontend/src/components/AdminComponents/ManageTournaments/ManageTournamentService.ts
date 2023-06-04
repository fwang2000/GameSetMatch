import { Match, MatchForAdmin } from '../../../interfaces/MatchInterface';
import { Tournament } from '../../../interfaces/TournamentInterface';
import SecurityService from '../../../security/SecurityService';
import handleErrors from '../../General/ServiceHelper';

const baseURL = `${process.env.REACT_APP_API_DOMAIN}/api`;

const baseTournamentsURL = `${process.env.REACT_APP_API_DOMAIN}/api/tournaments`;

const saveUpdatedSchedule = (tournamentID:number, roundID: number, matches: Match[]) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}/round/${roundID}
`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(matches),
  })).then((resp) => handleErrors(resp));

const publishSchedule = (matches:Match[]) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(matches),
  })).then((resp) => handleErrors(resp));

const createSchedule = (tournamentID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}/runCreateSchedule`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })).then((resp) => handleErrors(resp));

interface CreateTournamentRequestBody {
  name: string,
  description: string,
  startDate: Date,
  location: string,
  prize: string,
  format: number,
  matchBy: number,
  closeRegistrationDate: Date,
  matchDuration: number,
  series: number,
  adminHostsTournament:number
}

const createTournament = (body: CreateTournamentRequestBody) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  })).then((resp) => handleErrors(resp));

const closeRegistration = (tournamentID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}/closeRegistration`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })).then((resp) => handleErrors(resp));

interface UpdateTournamentRequestBody {
  name: string,
  description: string,
  startDate: Date,
  location: string,
  prize: string,
  format: number,
  matchBy: number,
  closeRegistrationDate: Date,
  matchDuration: number,
  series: number,
}

const updateTournament = (tournamentID:Number, body: UpdateTournamentRequestBody) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  })).then((resp) => handleErrors(resp));

const getUsersCreatedTournaments = (userID:number, status:number[]) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}?createdBy=${userID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ statuses: status }),
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

const getMatchesNeedingScheduling = (roundID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/rounds/${roundID}/matches`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json())
  .then((data) => data.map((item: MatchForAdmin) => ({
    matchID: item.matchID,
    name: `${item.participants[0].name} vs. ${item.participants[1].name}`,
    startTime: new Date(item.startTime),
    endTime: new Date(item.endTime),
    roundID: item.roundID,
    matchStatus: item.matchStatus,
    playerOneID: item.playerOneID,
    playerTwoID: item.playerTwoID,
    participants: item.participants,
  })));

const DeleteTournamentErrorCodes = {
  SEND_EMAIL_ERROR_MAIL: 'Tournament was deleted, but there was an error notifying registrants. Please check your mail configurations.',
  SEND_EMAIL_ERROR_MESSAGING: 'Tournament was deleted, but there was an error notifying registrants.',
};
const deleteTournament = (tournamentID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })).then((resp) => handleErrors(resp));

const getLatestRound = (tournamentID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}/rounds`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((resp) => handleErrors(resp))
  .then((response:any) => response.json())
  .then((data:any) => {
    const latestRound = data.reduce((acc:any, curr:any) => ((acc.roundNumber - curr.roundNumber > 0) ? acc : curr), {});
    return latestRound;
  });

interface CheckNewMatchTime {
  newMatchAsAvailabilityString:string,
  dayOfWeek:number,
}

const checkNewMatchTime = (
  tournamentID:number,
  matchID:number,
  newMatchInfo:CheckNewMatchTime,
) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}/match/${matchID}/checkNewTime`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(newMatchInfo),
  })).then((resp) => handleErrors(resp));

const endCurrentRound = (tournamentID:number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseTournamentsURL}/${tournamentID}/endCurrentRound`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })).then((resp) => handleErrors(resp));

const ManageTournamentService = {
  createTournament,
  updateTournament,
  getUsersCreatedTournaments,
  createSchedule,
  publishSchedule,
  saveUpdatedSchedule,
  getMatchesNeedingScheduling,
  closeRegistration,
  deleteTournament,
  getLatestRound,
  checkNewMatchTime,
  DeleteTournamentErrorCodes,
  endCurrentRound,
};
export default ManageTournamentService;
