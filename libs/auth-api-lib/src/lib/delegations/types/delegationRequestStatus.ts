export enum DelegationRequestStatus {
  /** Awaiting a decision from the prospective grantor. */
  Pending = 'pending',
  /** Grantor approved and a delegation was created. */
  Approved = 'approved',
  /** Grantor declined the request. */
  Rejected = 'rejected',
  /** Requester withdrew the request before it was resolved. */
  Cancelled = 'cancelled',
  /** Request passed its expiry date without being resolved. */
  Expired = 'expired',
}
