import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useAtomValue } from 'jotai';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import StyledPaper from '../General/StyledPaper';
import BackButton from '../General/BackButton';
import StyledButton from '../General/StyledButton';
import AvailabilitySelector, { Availability, transformToAvailabilityString } from '../General/Calendar/AvailabilityCalendar/AvailabilitySelector';
import TournamentService, { RegisterForTournamentBody } from './TournamentsService';
import StatusModal from '../General/StatusModal';
import { userIDAtom } from '../../atoms/userAtom';
import { SkillLevels, Tournament } from '../../interfaces/TournamentInterface';
import { ReactBigCalendarEvent } from '../../interfaces/EventInterface';
import StyledSelect from '../General/StyledSelect';
import DateHelpers from '../General/Calendar/DateHelpers';

interface RegisterTournamentState {
  tournament:Tournament;
}

function RegisterTournament() {
  const location = useLocation();
  const state = location.state as RegisterTournamentState;
  const navigate = useNavigate();

  const { tournament } = state;
  const [availabilities, setAvaliabilities] = useState<ReactBigCalendarEvent[]>([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [skillLevel, setSkillLevel] = useState(0);
  const userID = useAtomValue(userIDAtom);

  const submitRegistration = () => {
    setLoading(true);
    setError(false);
    const availabilityDTO:Availability[] = transformToAvailabilityString(availabilities);
    const registration:RegisterForTournamentBody = {
      userID,
      skillLevel,
      availabilities: availabilityDTO,
    };
    TournamentService.registerForTournament(tournament.tournamentID, registration)
      .then(() => {
        setLoading(false);
        setOpen(true);
      })
      .catch(() => {
        setError(true);
        setOpen(true);
      });
  };

  const handleSuccessDialogClose = () => {
    navigate(-1);
  };

  const handleErrorDialogClose = () => {
    setOpen(false);
  };

  React.useMemo(() => {
    setCanSubmit(availabilities.length !== 0);
  }, [availabilities]);

  return (
    <StyledPaper>
      <Grid container spacing={2} direction="column" alignItems="flex-start">
        <Grid item>
          <BackButton />
          <Card>
            <CardContent>
              <Typography variant="h6">
                {`Registration for:  ${tournament.name}`}
              </Typography>
              {tournament.location.length > 0 && (
              <Typography variant="body1">
                {`Location:  ${tournament.location}`}
              </Typography>
              )}
              <Typography variant="body1">
                {`Match Duration:  ${tournament.matchDuration} minutes`}
              </Typography>
              <Typography variant="body1">
                {`Start Date:  ${DateHelpers.formatDateForDisplay(new Date(tournament.startDate))}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h6">Please select your skill level: </Typography>
              <StyledSelect
                id="skill"
                label="Skill Level"
                selectOptions={SkillLevels.map((text:string, index:number) => ({ value: index, text }))}
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                width={6}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <AvailabilitySelector
            availabilities={availabilities}
            setAvailabilities={setAvaliabilities}
          />
        </Grid>
        <Grid item style={{ width: '100%' }} justifyContent="end">
          <Tooltip title={canSubmit ? '' : 'Please provide your availability'}>
            <span>
              <StyledButton buttonText="Register" handleClick={submitRegistration} disabled={!canSubmit} />
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      {loading && <CircularProgress />}
      {error ? (
        <StatusModal
          open={open}
          handleDialogClose={handleErrorDialogClose}
          dialogText="There was an error with registration, please contact your administrator."
          dialogTitle="Error"
          isError={error}
        />
      ) : (
        <StatusModal
          open={open}
          handleDialogClose={handleSuccessDialogClose}
          dialogText="You have successfully registered for the tournament.
      After registration closes, you will recieve an e-mail containing the tournament schedule."
          dialogTitle="Registration Success!"
          isError={error}
        />
      )}
    </StyledPaper>
  );
}

export default RegisterTournament;
