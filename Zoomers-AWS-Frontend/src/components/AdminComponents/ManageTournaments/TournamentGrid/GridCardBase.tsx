/* eslint-disable react/require-default-props */
import React from 'react';

import { useTheme } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Paper, Theme } from '@mui/material';
import { Tournament } from '../../../../interfaces/TournamentInterface';
import TournamentDetailsDialog from './TournamentDetailsDialog';
import TournamentForm from '../TournamentForm/TournamentForm';
import StatusModal from '../../../General/StatusModal';
import LoadingOverlay from '../../../General/LoadingOverlay';
import ManageTournamentService from '../ManageTournamentService';
import { TournamentRow, TournamentStatus } from '../ManageTournamentsEnums';
import ConfirmActionModal from '../../../General/ConfirmActionModal';

interface GridCardManageTournamentBaseProps{
  tournament:Tournament,
  formTournament:Tournament | undefined,
  setFormTournament:(arg0:Tournament | undefined) => void,
  buttonName?:string,
  onButtonClick?:() => void,
  buttonName2?:string,
  onButtonClick2?:() => void,
  enableEdit:boolean,
  enableDelete:boolean,
  disabledButton1?:boolean,
  disabledButton2?:boolean,
  tooltip1?:string,
  tooltip2?:string,
  gridCardDetails?: React.ReactNode,
  tournamentRows?: TournamentRow[],
  setTournamentRows?:(arg0:TournamentRow[]) => void,
}

const deleteTournamentTooltip = (enabled:boolean, status:number):string => {
  if (enabled) return 'Delete';
  switch (status) {
    case TournamentStatus.TournamentOver:
      return 'Deleting a finished tournament is not permitted';
    default:
      return 'Unable to delete a tournament in progress';
  }
};
function GridCardManageTournamentBase({
  tournament, buttonName = '', onButtonClick,
  buttonName2 = '', onButtonClick2,
  enableEdit, enableDelete, formTournament,
  setFormTournament,
  disabledButton1,
  disabledButton2,
  tooltip1 = '',
  tooltip2 = '',
  gridCardDetails,
  tournamentRows,
  setTournamentRows,
}:GridCardManageTournamentBaseProps) {
  const theme = useTheme() as Theme;
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
  const [confirmationTitle, setConfirmationTitle] = React.useState('Confirm Delete');
  const [confirmationText, setConfirmationText] = React.useState('Are you sure you want to delete?');

  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [removeFromPage, setRemoveFromPage] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('Unexpected error deleting the tournament.');

  const handleDialogClose = () => {
    setStatusModalOpen(false);
    setLoading(false);
    if (removeFromPage && setTournamentRows && tournamentRows) {
      const updatedRows = tournamentRows.filter((t:TournamentRow) => t.id !== tournament.tournamentID);
      setTournamentRows(updatedRows);
    }
  };

  const [currentTournament, setCurrentTournament] = React.useState(tournament);
  const openDetails = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTournament = () => {
    setError(false);
    setLoading(true);
    ManageTournamentService.deleteTournament(currentTournament.tournamentID).then(() => {
      setStatusModalOpen(true);
      setRemoveFromPage(true);
    }).catch((err:Error) => {
      if (err.message === 'SEND_EMAIL_ERROR_MAIL') {
        setErrorMessage(ManageTournamentService.DeleteTournamentErrorCodes.SEND_EMAIL_ERROR_MAIL);
        setRemoveFromPage(true);
      } else if (err.message === 'SEND_EMAIL_ERROR_MESSAGING') {
        setErrorMessage(ManageTournamentService.DeleteTournamentErrorCodes.SEND_EMAIL_ERROR_MESSAGING);
        setRemoveFromPage(true);
      } else {
        setErrorMessage(err.message);
      }
      setLoading(false);
      setError(true);
      setStatusModalOpen(true);
    });
  };

  const confirmDelete = () => {
    setConfirmationTitle('Confirm delete');
    setConfirmationText('Are you sure you want to delete');
    setConfirmationModalOpen(true);
  };

  const editTournament = () => {
    setFormTournament({ ...currentTournament });
    setOpenEdit(true);
  };

  return (
    <Paper style={{ width: '100%', backgroundColor: theme.palette.background.paper }}>
      <Grid
        container
        sx={{
          px: 2, py: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        }}
      >
        <Grid item style={{ textAlign: 'left' }}>
          <Typography variant="h5">
            {currentTournament.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            {currentTournament.description}
          </Typography>
          {gridCardDetails}
          <Box sx={{ mt: 1 }}>
            <Button size="small" color="secondary" onClick={openDetails}>Details</Button>
          </Box>
        </Grid>
        <Grid
          item
          sx={{
            display: 'flex', alignItems: 'center', pl: 1, pb: 1,
          }}
        >
          <Tooltip title={deleteTournamentTooltip(enableDelete, currentTournament.status)} placement="top-start">
            <span>
              <IconButton color="secondary" aria-label="delete" disabled={!enableDelete} onClick={confirmDelete}>
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit">
            <span>
              <IconButton color="secondary" aria-label="edit" disabled={!enableEdit} onClick={editTournament}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Grid container sx={{ display: 'flex', flexDirection: 'column' }} spacing={1}>
            <Grid item>
              <Tooltip title={disabledButton1 ? tooltip1 : ''}>
                <span>
                  {buttonName && <Button size="small" color="secondary" disabled={disabledButton1} onClick={onButtonClick}>{buttonName}</Button>}
                </span>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={disabledButton2 ? tooltip2 : ''}>
                <span>
                  {buttonName2 && <Button size="small" color="secondary" disabled={disabledButton2} onClick={onButtonClick2}>{buttonName2}</Button>}
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TournamentDetailsDialog open={open} handleClose={handleClose} tournament={currentTournament} fullScreen={fullScreen} />
      <TournamentForm tournament={formTournament} setTournament={setCurrentTournament} open={openEdit} setOpen={setOpenEdit} />
      <StatusModal
        open={statusModalOpen}
        handleDialogClose={handleDialogClose}
        dialogText={error ? `${errorMessage}`
          : 'Tournament was deleted.'}
        dialogTitle={error ? 'Error' : 'Success'}
        isError={error}
      />
      <ConfirmActionModal
        open={confirmationModalOpen}
        setOpen={setConfirmationModalOpen}
        dialogText={confirmationText}
        dialogTitle={confirmationTitle}
        onConfirm={deleteTournament}
      />
      <LoadingOverlay isOpen={loading} />
    </Paper>
  );
}

export default GridCardManageTournamentBase;
