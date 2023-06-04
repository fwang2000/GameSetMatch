import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import { Theme } from '@mui/material';

interface MenuItemParams {
  id:string,
  label: string,
  route:string,
  icon: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  onClick?:() => void;
}

function MenuItem({
  id, label, route, icon, onClick,
}:MenuItemParams) {
  const navigate = useNavigate();

  const theme = useTheme() as Theme;

  const routeToPage = () => {
    if (onClick) {
      onClick();
    }
    navigate(route);
  };
  return (
    <ListItem button id={id} onClick={routeToPage}>
      <ListItemIcon>
        <div style={{ color: theme.palette.secondary.main }}>
          {icon}
        </div>
      </ListItemIcon>
      <ListItemText primary={(
        <Typography>
          {label}
        </Typography>
    )}
      />
    </ListItem>
  );
}

export default MenuItem;
