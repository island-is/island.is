/**
 * Machine-readable error codes for delegation-request guardrails, surfaced as
 * the problem `detail` so clients can show specific messaging.
 */
export enum DelegationRequestError {
  /** The requester has reached the cap of simultaneously pending requests. */
  TooManyPending = 'DELEGATION_REQUEST_TOO_MANY_PENDING',
  /**
   * The requester has received too many rejections within the lock window and
   * is blocked from creating new requests until rejections age out of it.
   */
  Blocked = 'DELEGATION_REQUEST_BLOCKED',
}
