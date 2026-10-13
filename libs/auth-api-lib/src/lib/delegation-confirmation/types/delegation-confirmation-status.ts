export enum DelegationConfirmationStatus {
  Pending = 'pending',
  /** Evidence: never updated after this. */
  Confirmed = 'confirmed',
  Expired = 'expired',
  Rejected = 'rejected',
  Superseded = 'superseded',
}

export const isTerminalConfirmationStatus = (
  status: DelegationConfirmationStatus,
): boolean => status !== DelegationConfirmationStatus.Pending
