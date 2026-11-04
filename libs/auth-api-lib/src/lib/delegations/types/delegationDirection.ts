/**
 * Enum to indicate flow of delegation between two users.
 */
export enum DelegationDirection {
  /** Delegations that a user has been granted. */
  INCOMING = 'incoming',

  /** Delegations that a user has given others. */
  OUTGOING = 'outgoing',

  /** All custom-delegation scopes, not narrowed to what the user can grant. */
  REQUEST = 'request',
}
