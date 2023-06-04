/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Typography, Paper, Grid, Tabs, Tab,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import { userIDAtom } from '../../../atoms/userAtom';
import { Match } from '../../../interfaces/MatchInterface';
import { TournamentRow } from '../../BrowseTournaments/BrowseTournamentsGrid';
import TournamentService from '../../BrowseTournaments/TournamentsService';
import MatchHistoryGrid from './MatchHistoryGrid';
import RegisteredGrid from './RegisteredGrid';

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: number;
  value: number;
}

const enum TabNames {
  MatchHistory,
  RegisteredTournaments,
}

function TabPanel(props: TabPanelProps) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface OverviewTabsProps {
  matches:Match[],
  setMatches:(arg0:Match[]) => void,
}

function OverviewTabs({ matches, setMatches }:OverviewTabsProps) {
  const [value, setValue] = React.useState(0);
  const [tournamentRows, setTournamentRows] = React.useState<TournamentRow[]>([]);
  const userID = useAtomValue(userIDAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // get registered tournaments on tab click?
  };

  React.useEffect(() => {
    TournamentService.getRegisteredTournaments(userID)
      .then((tournaments) => {
        setTournamentRows(tournaments);
      });
  }, []);

  return (
    <Paper sx={{
      p: 2, minHeight: '90vh', maxHeight: '90vh', minWidth: '35%',
    }}
    >
      <Grid container maxWidth="md" spacing={1} justifyContent="space-between">
        <Grid item sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              textColor="secondary"
              indicatorColor="secondary"
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Match History" {...a11yProps(0)} />
              <Tab label="Registered Tournaments" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={TabNames.MatchHistory}>
            <MatchHistoryGrid matches={matches} setMatches={setMatches} />
          </TabPanel>
          <TabPanel value={value} index={TabNames.RegisteredTournaments}>
            <RegisteredGrid tournamentRows={tournamentRows} setTournamentRows={setTournamentRows} />
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default OverviewTabs;
