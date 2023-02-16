export const enum SessionType {
  // The session is a user session
  self = 'self',
  // The session is a session where the user is acting on behalf of another user
  onBehalf = 'onBehalf',
  // The session is a session where the user is being acted on behalf of by another user
  myBehalf = 'myBehalf',
  // The session is a session where the user is acting on behalf of a company
  company = 'company',
}
