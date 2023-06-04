import React from 'react';

import {
  styled, useTheme, Theme, CSSObject,
} from '@mui/material/styles';

import {
  Outlet,
} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
// import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';

import { useAtom } from 'jotai';
import MenuItem from './MenuItem';
import LogoIconNameSideBySide from '../Logo/LogoIconNameSideBySide';
import navigation from './navigation.json';
import { emptyUser, loginDataAtomPersistence } from '../../atoms/userAtom';
import DisplayUser from '../Profile/DisplayUser';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.primary.main,
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function NavigationSideBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useAtom(loginDataAtomPersistence);
  const [isAdmin] = React.useState(userData ? userData.isAdmin >= 1 : false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setUserData(emptyUser);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            style={{ color: theme.palette.secondary.main }}
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <DisplayUser />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open && (
            <LogoIconNameSideBySide />
          )}
          <IconButton onClick={handleDrawerClose} style={{ color: theme.palette.secondary.main, justifyContent: 'flex-end' }}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <MenuItem id="dashboard" label="Dashboard" icon={<HomeIcon />} route={navigation.dashboard} />
          <MenuItem id="browse-tournament" label="Browse Tournaments" icon={<SearchIcon />} route={navigation.browseTournament} />
          <MenuItem id="tournament-history" label="Tournament History" icon={<HistoryIcon />} route={navigation.tournamentHistory} />
          {
          isAdmin && (
            <>
              <Divider />
              <MenuItem id="manage-tournaments" label="Manage Tournaments" icon={<AccountTreeIcon />} route={navigation.manageTournaments} />
              <MenuItem id="manage-users" label="Manage Users" icon={<ManageAccountsIcon />} route={navigation.manageUsers} />
            </>
          )
        }
        </List>
        <div style={{ position: 'absolute', bottom: 0 }}>
          {/* <MenuItem id="settings" label="Settings" icon={<SettingsIcon />} route={navigation.settings} /> */}
          <MenuItem id="logout" label="Logout" icon={<LogoutIcon />} route={navigation.logout} onClick={handleLogout} />
        </div>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

export default NavigationSideBar;
