export interface User {
  email: String,
  firebaseId: String,
  id: number,
  role: number,
  name: String,
  picture: String,
}

export enum UserRoles {
  Employee,
  Admin,
  RootAdmin,
}
