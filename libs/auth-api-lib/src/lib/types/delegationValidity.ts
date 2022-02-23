/**
 * Enum to provide filter values to filter delegation by date period validity.
 */
export enum DelegationValidity {
  /** Includes all delegations */
  ALL = 'all',

  /** Only delegations that are valid for the current datetime (active) */
  NOW = 'now',

  /** Only delegations that are expired (inactive) for the current datetime */
  PAST = 'past',

  /** Same as 'NOW' but also includes delegations that will become active in the future */
  INCLUDE_FUTURE = 'includeFuture',
}
