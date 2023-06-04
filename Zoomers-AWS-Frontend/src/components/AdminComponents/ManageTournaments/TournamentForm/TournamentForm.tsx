/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import {
  Button,
  CircularProgress,
  DialogActions, DialogContent, DialogTitle, Grid, Tooltip,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import { useAtomValue } from 'jotai';
import { Tournament } from '../../../../interfaces/TournamentInterface';
import StyledButton from '../../../General/StyledButton';
import StyledDatePicker from '../../../General/StyledDatePicker';
import StyledInputField from '../../../General/StyledInputField';
import StyledSelect from '../../../General/StyledSelect';
import ManageTournamentService from '../ManageTournamentService';
import StatusModal from '../../../General/StatusModal';
import { userIDAtom } from '../../../../atoms/userAtom';
import {
  FormatType, MatchingType, SeriesType, TabNames, TournamentStatus,
} from '../ManageTournamentsEnums';
import ValidationSchemes from './TournamentFormValidationSchemes';

interface TournamentFormProps {
  open:boolean,
  tournament?: Tournament,
  setTournament?: (arg0:Tournament) => void,
  setOpen: (arg0: boolean) => void,
  updateGrid?:(arg0:boolean) => void,
  currentTab?:number
}
// TODO disable and enable fields based on tournament status
const tournamentTemplate = {
  name: '',
  description: '',
  startDate: new Date(),
  location: '',
  prize: '',
  format: 0,
  matchBy: 0,
  closeRegistrationDate: new Date(),
  matchDuration: 1,
  series: 0,
  adminHostsTournament: 0,
  minParticipants: 2,
  status: 0,
};

const startDateErrorMessage = `Start date must be ${ValidationSchemes.startDateMinDaysAfterRegistration} days after registration period closes`;

const isStartDateAfterRegistration = (startDate:Date | null, registration:Date):boolean => {
  if (!startDate) {
    return true;
  }
  const startDateMoment = moment(startDate);
  const registrationDateMoment = moment(registration);
  const duration = moment.duration(startDateMoment.diff(registrationDateMoment));
  return duration.asDays() >= ValidationSchemes.startDateMinDaysAfterRegistration;
};

function TournamentForm({
  open, setOpen, tournament = undefined, setTournament, updateGrid, currentTab,
}: TournamentFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [responseOpen, setResponseOpen] = React.useState(false);
  const [formValidation, setFormValidation] = React.useState(tournament
    ? ValidationSchemes.getEditScheme(tournament.status) : ValidationSchemes.create());
  const userID = useAtomValue(userIDAtom);

  const formik = useFormik({
    initialValues: tournament || tournamentTemplate,
    validationSchema: formValidation,
    onSubmit: (values) => {
      setLoading(true);
      if (tournament) {
        ManageTournamentService.updateTournament(tournament.tournamentID, values).then(() => {
          setLoading(false);
          if (setTournament) {
            const updatedTournament = { ...tournament };
            updatedTournament.name = values.name;
            updatedTournament.description = values.description;
            updatedTournament.startDate = values.startDate;
            updatedTournament.location = values.location;
            updatedTournament.prize = values.prize;
            updatedTournament.format = values.format;
            updatedTournament.matchBy = values.matchBy;
            updatedTournament.closeRegistrationDate = values.closeRegistrationDate;
            updatedTournament.matchDuration = values.matchDuration;
            updatedTournament.series = values.series;
            updatedTournament.minParticipants = values.minParticipants;
            setTournament(updatedTournament);
          }

          setResponseOpen(true);
        })
          .catch(() => {
            setLoading(false);
            setError(true);
            setResponseOpen(true);
          });
      } else {
        const request = values;
        request.adminHostsTournament = userID;
        request.status = 0;
        ManageTournamentService.createTournament(request).then(() => {
          setLoading(false);
          setResponseOpen(true);
          if (updateGrid && tournament === undefined) {
            updateGrid(currentTab === TabNames.OpenForRegistration);
          }
        })
          .catch(() => {
            setLoading(false);
            setError(true);
            setResponseOpen(true);
          });
      }
    },
  });

  const [fieldsChanged, setFieldsChanged] = React.useState(false);
  const checkFieldsChanged = () => {
    if (tournament) {
      setFieldsChanged((formik.values.name !== tournament.name)
      || (formik.values.description !== tournament.description)
      || (formik.values.startDate !== tournament.startDate)
      || (formik.values.location !== tournament.location)
      || (formik.values.prize !== tournament.prize)
      || (formik.values.format !== tournament.format)
      || (formik.values.matchBy !== tournament.matchBy)
      || (formik.values.closeRegistrationDate !== tournament.closeRegistrationDate)
      || (formik.values.matchDuration !== tournament.matchDuration)
      || (formik.values.minParticipants !== tournament.minParticipants)
      || (formik.values.series !== tournament.series));
      if (!fieldsChanged) formik.setErrors({});
      return;
    }

    if ((formik.values.name !== tournamentTemplate.name)
    || (formik.values.description !== tournamentTemplate.description)
    || (formik.values.startDate !== tournamentTemplate.startDate)
    || (formik.values.location !== tournamentTemplate.location)
    || (formik.values.prize !== tournamentTemplate.prize)
    || (formik.values.format !== tournamentTemplate.format)
    || (formik.values.matchBy !== tournamentTemplate.matchBy)
    || (formik.values.closeRegistrationDate !== tournamentTemplate.closeRegistrationDate)
    || (formik.values.matchDuration !== tournamentTemplate.matchDuration)
    || (formik.values.minParticipants !== tournamentTemplate.minParticipants)
    || (formik.values.series !== tournamentTemplate.series)) {
      setFieldsChanged(true); return;
    }
    formik.setErrors({});
    setFieldsChanged(false);
  };

  const [enabledByStatus, setEnabledByStatus] = React.useState(true);
  const [tournamentOver, setTournamentOver] = React.useState(true);

  const handleClose = () => {
    formik.resetForm();
    formik.setErrors({});
    setOpen(!open);
  };

  const handleSuccessDialogClose = () => {
    setResponseOpen(false);
    if (updateGrid && currentTab && tournament === undefined) {
      updateGrid(currentTab === 0);
    }
    handleClose();
  };

  const handleErrorDialogClose = () => {
    setResponseOpen(false);
  };

  React.useMemo(() => {
    formik.resetForm();
    setEnabledByStatus(tournament ? tournament.status >= TournamentStatus.ReadyToSchedule : false);
    setTournamentOver(tournament ? tournament.status === TournamentStatus.TournamentOver : false);
    formik.setValues(tournament ? { ...tournament } : { ...tournamentTemplate });
    setFormValidation(tournament ? ValidationSchemes.getEditScheme(tournament.status) : ValidationSchemes.create());
  }, [open, tournament]);

  React.useEffect(() => {
    checkFieldsChanged();
  });

  return (
    <Dialog
      open={open}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {`${tournament ? 'Edit' : 'Create'} your tournament`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1.5} mt={0.1} display="flex">
            <StyledInputField
              id="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name ? formik.errors.name : ''}
              required
              disabled={tournamentOver}
            />
            <StyledInputField
              id="description"
              label="Tournament Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.description)}
              helperText={formik.errors.description}
              disabled={tournamentOver}
            />
            <StyledInputField
              id="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.location)}
              helperText={formik.errors.location}
              disabled={tournamentOver}
            />
            <StyledInputField
              id="prize"
              label="Prize"
              value={formik.values.prize}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.prize)}
              helperText={formik.errors.prize}
              disabled={tournamentOver}
            />
            <StyledInputField
              id="matchDuration"
              label="Match Duration"
              value={formik.values.matchDuration}
              onChange={formik.handleChange}
              width={6}
              type="number"
              required
              error={formik.touched.matchDuration && Boolean(formik.errors.matchDuration)}
              helperText={formik.touched.matchDuration ? formik.errors.matchDuration : ''}
              endAdornment="minutes"
              disabled={tournamentOver}
            />
            <StyledInputField
              id="minParticipants"
              label="Minumum Players"
              value={formik.values.minParticipants}
              onChange={formik.handleChange}
              width={6}
              type="number"
              required
              error={formik.touched.minParticipants && Boolean(formik.errors.minParticipants)}
              helperText={formik.touched.minParticipants ? formik.errors.minParticipants : ''}
              disabled={enabledByStatus}
            />
            <StyledSelect
              id="series"
              label="Series Type"
              selectOptions={SeriesType.map((text, index) => ({ value: index, text }))}
              value={formik.values.series}
              onChange={formik.handleChange('series')}
              width={6}
              disabled={enabledByStatus}
            />
            <StyledSelect
              id="format"
              label="Format"
              selectOptions={FormatType.map((text, index) => ({ value: index, text }))}
              value={formik.values.format}
              onChange={formik.handleChange('format')}
              disabled={enabledByStatus}
              width={6}
            />
            <StyledSelect
              id="matchBy"
              label="Match participants"
              selectOptions={MatchingType.map((text, index) => ({ value: index, text }))}
              value={formik.values.matchBy}
              onChange={formik.handleChange('matchBy')}
              disabled={enabledByStatus}
              width={6}
            />
            <StyledDatePicker
              label="Close Registration Date"
              value={formik.values.closeRegistrationDate}
              disabled={enabledByStatus}
              onChange={(newValue) => {
                formik.setFieldTouched('closeRegistrationDate');
                formik.setFieldValue(
                  'closeRegistrationDate',
                  newValue,
                );
              }}
              error={Boolean(formik.errors.closeRegistrationDate)}
              helperText={
                  (formik.touched.closeRegistrationDate && formik.errors.closeRegistrationDate)
                    ? 'Registration close date cannot be in the past' : ''
                }
            />
            <StyledDatePicker
              label="Start Date"
              value={formik.values.startDate}
              disabled={enabledByStatus}
              onChange={(newValue) => {
                formik.setFieldTouched('startDate');
                formik.setFieldValue(
                  'startDate',
                  newValue,
                );
                if (!isStartDateAfterRegistration(newValue, formik.values.closeRegistrationDate)) {
                  formik.setFieldError('startDate', startDateErrorMessage);
                }
              }}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={
                (formik.touched.startDate && formik.errors.startDate)
                  ? startDateErrorMessage : ''
                }
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <StyledButton buttonText="Cancel" handleClick={handleClose} size="large" />
          <Tooltip title={fieldsChanged ? '' : tournament ? 'No changes to save.' : 'Please fill out the form'}>
            <span>
              <Button type="submit" size="large" color="secondary" disabled={!fieldsChanged}>{`${tournament ? 'Save' : 'Add'}`}</Button>
            </span>
          </Tooltip>
        </DialogActions>
      </form>
      {loading && <CircularProgress />}
      {error ? (
        <StatusModal
          open={responseOpen}
          handleDialogClose={handleErrorDialogClose}
          dialogText={`There was an error with ${tournament ? 'updating' : 'creating'} 
          the tournament, please try again later or contact your administrator.`}
          dialogTitle="Error"
          isError={error}
        />
      ) : (
        <StatusModal
          open={responseOpen}
          handleDialogClose={handleSuccessDialogClose}
          dialogText={tournament ? 'Update was successful'
            : 'Your tournament is now open for registration.  After registration closes, a tournament schedule will be proposed for you to verify.'}
          dialogTitle="Success!"
          isError={error}
        />
      )}
    </Dialog>
  );
}

export default TournamentForm;
