export enum DelegationConfirmationStatus {
  /** Awaiting a fresh high-assurance authentication by the grantor. */
  Pending = 'pending',
  /** Redeemed. The row is now an evidence record and must never be mutated. */
  Confirmed = 'confirmed',
  /** The confirmation window elapsed without a redemption. */
  Expired = 'expired',
  /** Explicitly abandoned by the grantor. */
  Rejected = 'rejected',
  /** Replaced by a newer request covering the same grantor/recipient/domain. */
  Superseded = 'superseded',
}

/**
 * Statuses that can still transition. Everything else is terminal, and rows in
 * a terminal state are never updated.
 */
export const isTerminalConfirmationStatus = (
  status: DelegationConfirmationStatus,
): boolean => status !== DelegationConfirmationStatus.Pending
