export enum DelegationConfirmationStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Expired = 'expired',
  Rejected = 'rejected',
  Superseded = 'superseded',
}

export const isTerminalConfirmationStatus = (
  status: DelegationConfirmationStatus,
): boolean => status !== DelegationConfirmationStatus.Pending
