/**
 * Enum to indicate flow of delegation between two users.
 */
export enum DelegationDirection {
  /** Delegations that a user has been granted. */
  INCOMING = 'incoming',

  /** Delegations that a user has given others. */
  OUTGOING = 'outgoing',

  /**
   * The full catalog of scopes that support custom delegation, unfiltered by
   * the current user's own grantable scopes. Used by the request-a-delegation
   * flow, where a user asks for scopes they do not already have.
   */
  REQUEST = 'request',
}
