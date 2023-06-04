import { useAtomValue } from 'jotai';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button/Button';
import { loginDataAtom } from '../../../atoms/userAtom';
import ManageUsersService from './ManageUsersService';

/* eslint-disable max-len */
// used code from : https://www.codegrepper.com/code-examples/javascript/regex+for+email+validation
const validateEmail = (email : string) => String(email).toLowerCase().match(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

const baseURL = window.location.href.replace(window.location.pathname, '/');

function ManageUsers() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setDisplayMessage] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [email, setEmail] = useState('');

  const submitAdminEmail = (e : any) => {
    e.preventDefault();
    const result = validateEmail(email);
    if (result === null) {
      setDisplayMessage('Invalid Email');
      setIsRegistered(true);
    } else {
      ManageUsersService.assignAdminToUserByEmail(email).then((response) => {
        setDisplayMessage(response);
        setIsRegistered(true);
      }).catch((error) => {
        setIsRegistered(true);
        setDisplayMessage(error);
      });
    }
  };

  const generateInvitationCode = (e : any) => {
    e.preventDefault();
    ManageUsersService.generateInvitationCode().then((data) => {
      setIsGenerated(true);
      (document.getElementById('invitationCode') as HTMLInputElement).value = baseURL.concat(data.invitationCode);
    });
  };

  const clickToCopy = () => {
    const copyText = document.getElementById('invitationCode') as HTMLInputElement;
    /* Select the text field */
    copyText?.select();
    copyText?.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
  };

  const handleChange = (e : any) => {
    setEmail(e.target.value);
  };

  const userData = useAtomValue(loginDataAtom);
  return (
    <Paper style={{ padding: '5%' }}>
      {userData.isAdmin >= 1
        ? (
          <div>
            <Typography variant="h3" component="h4"> Manage Users </Typography>
            <div style={{ margin: '5%' }} />
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <div style={{ width: 'auto' }}> Type in the email address of the user to promote to admin </div>
              <TextField id="email" label="email" type="email" variant="outlined" onChange={handleChange} value={email} />
              <br />
              <Button variant="contained" onClick={submitAdminEmail}> Submit </Button>
              <br />
              {isRegistered
                ? (
                  <div style={{ width: 'auto' }}>
                    {message}
                  </div>
                ) : <div />}
            </Box>
            <div style={{ margin: '5%' }} />
            <div>
              <div style={{ width: 'auto' }}> To generate invitation code for sign up please click generate (valid for 7 days)</div>
              <div style={{ margin: '2%' }} />
              <Button variant="contained" onClick={generateInvitationCode}> Generate </Button>
              {isGenerated
                ? (
                  <div>
                    <div style={{ margin: '2%' }} />
                    <TextField disabled size="medium" id="invitationCode" variant="outlined" />
                    <span style={{ marginLeft: '1%' }} />
                    <Button variant="contained" size="large" onClick={clickToCopy}> Copy </Button>
                  </div>
                ) : <div /> }
            </div>
          </div>
        ) : <Typography>You are unauthorized to view this page.</Typography>}
    </Paper>
  );
}

export default ManageUsers;
