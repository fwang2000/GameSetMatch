import moment from 'moment';
import * as yup from 'yup';
import { TournamentStatus } from '../ManageTournamentsEnums';

const maxCharactersReached = (numCharacters:number) => `Maximum of ${numCharacters} characters allowed.`;

const startDateMinDaysAfterRegistration = 2;

const create = () => {
  const minCloseRegistrationDate = new Date();
  minCloseRegistrationDate.setDate(minCloseRegistrationDate.getDate() - 1);
  return yup.object({
    name: yup
      .string()
      .required('Name is required')
      .max(128, maxCharactersReached(128)),
    description: yup
      .string()
      .max(150, maxCharactersReached(150)),
    location: yup
      .string()
      .max(60, maxCharactersReached(60)),
    prize: yup
      .string()
      .max(60, maxCharactersReached(60)),
    matchDuration: yup
      .number()
      .min(1, 'Must be greater than 0')
      .max(720, 'Maximum match duration of 720 minutes allowed')
      .required('Match Duration is required'),
    minParticipants: yup
      .number()
      .min(2, 'Must be greater than 1')
      .max(300, 'Maximum of 300 participants allowed')
      .required('Minimum number of players is required'),
    startDate: yup
      .date()
      .when('closeRegistrationDate', (closeRegistrationDate, schema) => {
        const daysAfter = moment(new Date(closeRegistrationDate)).add(startDateMinDaysAfterRegistration, 'days');
        return schema.min(daysAfter);
      }),
    closeRegistrationDate: yup
      .date()
      .min(
        minCloseRegistrationDate,
        'Registration close date cannot be in the past',
      ),
  });
};

// const editOpenForRegistration = yup.object({
//   name: yup
//     .string()
//     .required('Name is required')
//     .max(128, maxCharactersReached(128)),
//   description: yup
//     .string()
//     .max(150, maxCharactersReached(150)),
//   location: yup
//     .string()
//     .max(60, maxCharactersReached(60)),
//   prize: yup
//     .string()
//     .max(60, maxCharactersReached(60)),
//   matchDuration: yup
//     .number()
//     .min(1, 'Must be greater than 0')
//     .required('Match Duration is required'),
//   startDate: yup
//     .date(),
//   closeRegistrationDate: yup
//     .date(),
// });

const editInProgress = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .max(128, maxCharactersReached(128)),
  description: yup
    .string()
    .max(150, maxCharactersReached(150)),
  location: yup
    .string()
    .max(60, maxCharactersReached(60)),
  prize: yup
    .string()
    .max(60, maxCharactersReached(60)),
  matchDuration: yup
    .number()
    .min(1, 'Must be greater than 0')
    .max(720, 'Maximum match duration of 720 minutes allowed')
    .required('Match Duration is required'),
  minParticipants: yup
    .number()
    .min(2, 'Must be greater than 1')
    .max(300, 'Maximum of 300 participants allowed')
    .required('Minimum number of players is required'),
});

const getEditScheme = (status:number) => {
  switch (status) {
    case TournamentStatus.OpenForRegistration:
      return create();
    default:
      return editInProgress;
  }
};

const ValidationSchemes = {
  create,
  getEditScheme,
  startDateMinDaysAfterRegistration,
};

export default ValidationSchemes;
