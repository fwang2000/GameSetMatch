/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/button-has-type */
import React from 'react';
import { useAtom } from 'jotai';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import { useNavigate, useParams } from 'react-router-dom';
import 'firebase/compat/auth';
import Divider from '@mui/material/Divider';
import {
  Container, Grid, Theme, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import { loginDataAtomPersistence } from '../atoms/userAtom';
import LogoLoginPage from '../components/Logo/LogoLoginPage';

const baseURL = `${process.env.REACT_APP_API_DOMAIN}/api`;

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};
firebase.initializeApp(config);

function FirebaseAuth() {
  const theme = useTheme() as Theme;
  const navigate = useNavigate();
  const [loginData, setLoginData] = useAtom(loginDataAtomPersistence);
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { invitationcode } = useParams();
  // Configure FirebaseUI.
  const uiConfig = {
  // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/dashboard',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult(authResult : any, redirectUrl: any) {
      // Note: the JWT Token returned from authResult has a different aud, use the one returned by getIdToken()
        const postURL = `${baseURL}/verifyIdToken`.concat(invitationcode ? `/${invitationcode}` : '');
        firebase.auth().currentUser?.getIdToken()
          .then((idToken) => fetch(postURL, {
            method: 'POST',
            body: idToken,
            headers: {
              'Content-Type': 'application/json',
            },
          }))
          .then((res) => {
            if (res.status === 200) {
              res.json().then((data) => {
                setLoginData(data);
                navigate('/dashboard');
              });
            } else {
              res.json().then((data) => {
                setLoginData(data);
                navigate('/registration');
              });
            }
          });
        return false;
      },
      signInFailure(error: any) {
        alert(error);
      },
    },
  };

  return (
    <Grid
      direction={`${matches ? 'row' : 'column'}`}
      justifyContent="space-evenly"
      alignItems="center"
      container
      style={{ minHeight: '100vh' }}
    >
      <Grid item>
        <Container>
          <LogoLoginPage width="200" height="175" />
        </Container>
      </Grid>
      {matches && (
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        textAlign="center"
        style={{ borderColor: '#CCC', marginTop: '15vh', marginBottom: '15vh' }}
      />
      )}
      <Grid item>
        <Container>
          <Typography variant="h2">Welcome back</Typography>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </Container>
      </Grid>
    </Grid>
  );
}

export default FirebaseAuth;
