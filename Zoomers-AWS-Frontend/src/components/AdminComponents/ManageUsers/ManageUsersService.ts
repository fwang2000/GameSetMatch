import SecurityService from '../../../security/SecurityService';

const baseURL = `${process.env.REACT_APP_API_DOMAIN}/api`;

const assignAdminToUserByEmail = (email : string) => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/user/${email}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })).then((response) => response.text());

const generateInvitationCode = () => SecurityService.authorizationToken()
  .then((idToken) => fetch(`${baseURL}/inviteCode`, {
    method: 'Post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })).then((response) => response.json());

const ManageUsersService = {
  assignAdminToUserByEmail,
  generateInvitationCode,
};

export default ManageUsersService;
