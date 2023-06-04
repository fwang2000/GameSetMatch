import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { useTheme } from '@emotion/react';
import { Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { CircularProgress } from '@mui/material';
import { useAtomValue } from 'jotai';
import TournamentService, { Registrant } from './TournamentsService';
import { userIDAtom } from '../../atoms/userAtom';

interface ViewRegistrantsProps {
  tournamentID: Number;
}

interface RegistrantListProps {
  registrants: Registrant[];
  currentUserID:number;
}

function RegistrantList({ registrants, currentUserID }:RegistrantListProps):JSX.Element {
  if (!registrants) {
    return <div>There was an error with retreiving registrants, try again later or contact the administrator</div>;
  }

  if (registrants.length === 0) {
    return <div>No registrants yet.</div>;
  }
  return (
    <Typography component="span" variant="body2">
      {`Total: ${registrants.length}`}
      <List sx={{
        overflow: 'auto',
        maxHeight: 150,
      }}
      >
        {registrants.map((registrant:Registrant) => (
          <ListItem key={`item-${registrant.userID}`}>
            <ListItemText>{`${registrant.name} [${registrant.email}] ${registrant.userID === currentUserID ? '(you)' : ''}`}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Typography>
  );
}

function ViewRegistrants({ tournamentID }:ViewRegistrantsProps) {
  const theme = useTheme() as Theme;
  const [expanded, setExpanded] = React.useState(false);
  const [registrants, setRegistrants] = React.useState<Registrant[]>([]);
  const [loading, setLoading] = React.useState(false);
  const userID = useAtomValue(userIDAtom);

  const handleChange = () => () => {
    if (!expanded) {
      setLoading(true);
      TournamentService.getRegistrants(tournamentID).then((data) => {
        setRegistrants(data);
        setLoading(false);
      });
    }
    setExpanded(!expanded);
  };

  return (
    <Accordion
      style={{
        backgroundColor: theme.palette.background.paper, margin: '10px 0px 5px 0px', border: '1px', borderColor: '#FFF',
      }}
      expanded={expanded}
      onChange={handleChange()}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: theme.palette.secondary.main }} />}
        aria-controls="panel4bh-content"
        id="panel4bh-header"
        style={{ backgroundColor: theme.palette.primary.dark }}
      >
        <Typography variant="body1">View Registered</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? <CircularProgress /> : <RegistrantList registrants={registrants} currentUserID={userID} />}
      </AccordionDetails>
    </Accordion>
  );
}

export default ViewRegistrants;
