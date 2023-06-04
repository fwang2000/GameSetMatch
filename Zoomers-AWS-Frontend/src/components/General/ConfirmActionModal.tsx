import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@emotion/react';
import { Theme } from '@mui/material/styles';
import styled from '@emotion/styled';

interface ConfirmActionModalProps{
  open:boolean,
  setOpen:(arg0:boolean) => void,
  dialogTitle:string,
  dialogText:string,
  onConfirm:() => void,
}

const StyledDialog = styled(Dialog)`
.MuiDialog-paper{
  padding:20px;
}
`;

function ConfirmActionModal({
  open, setOpen, dialogTitle, dialogText, onConfirm,
}:ConfirmActionModalProps) {
  const theme = useTheme() as Theme;

  const deny = () => {
    setOpen(false);
  };
  const confirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <StyledDialog
      open={open}
      onClose={setOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ color: theme.palette.primary.main, alignItems: 'center', padding: '20px' }}
    >
      <DialogTitle id="alert-dialog-title">
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ color: theme.palette.text.primary }} id="alert-dialog-description">
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={deny} autoFocus>
          No
        </Button>
        <Button color="secondary" onClick={confirm} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

export default ConfirmActionModal;
