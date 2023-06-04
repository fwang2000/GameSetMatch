import { Match, setMatchDetails } from '../../../interfaces/MatchInterface';
import SecurityService from '../../../security/SecurityService';
import handleErrors from '../../General/ServiceHelper';

const getAll = (id: number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${process.env.REACT_APP_API_DOMAIN}/api/match/involves/user/${id}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((resp) => handleErrors(resp))
  .then((response) => response.json());

const getPastMatches = (id: number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${process.env.REACT_APP_API_DOMAIN}/api/match/history/involves/user/${id}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json()).then((data) => data.map((item: Match) => ({
    results: item.results,
    attendance: item.attendance,
    matchID: item.matchID,
    startTime: item.startTime,
    endTime: item.endTime,
    name: item.name,
    location: item.location,
    description: item.description,
  })));

const getMatchInformationByMatchID = (id: number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${process.env.REACT_APP_API_DOMAIN}/api/match/${id}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }))
  .then((response) => response.json()).then((data) => setMatchDetails(data));

const confirmMatchAttendance = (id: number, mid: number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(
    `${process.env.REACT_APP_API_DOMAIN}/api/match/userAttendance`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ attendance: 'Yes', userID: id, matchID: mid }),
    },
  ));

const dropOutOfMatch = (id: number, mid: number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(
    `${process.env.REACT_APP_API_DOMAIN}/api/match/userAttendance`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ attendance: 'No', userID: id, matchID: mid }),
    },
  ));

const updateMatchAttendance = (id: number, mid: number, attendance:string) => SecurityService.authorizationToken()
  .then((idToken) => fetch(
    `${process.env.REACT_APP_API_DOMAIN}/api/match/userAttendance`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ attendance, userID: id, matchID: mid }),
    },
  )).then((resp) => handleErrors(resp));

const updateMatchResults = (id: number, mid: number, result: number) => SecurityService.authorizationToken()
  .then((idToken) => fetch(
    `${process.env.REACT_APP_API_DOMAIN}/api/match/userResults`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ results: result, userID: id, matchID: mid }),
    },
  )).then((resp) => handleErrors(resp));

const MatchService = {
  confirmMatchAttendance,
  getAll,
  getPastMatches,
  getMatchInformationByMatchID,
  dropOutOfMatch,
  updateMatchResults,
  updateMatchAttendance,
  setMatchDetails,
};

export default MatchService;
