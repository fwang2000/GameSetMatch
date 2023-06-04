import firebase from 'firebase/compat/app';

const authorizationToken = () => {
  const { currentUser } = firebase.auth();
  if (!currentUser) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('error');
  }
  return currentUser.getIdToken();
};

const SecurityService = {
  authorizationToken,
};

export default SecurityService;
