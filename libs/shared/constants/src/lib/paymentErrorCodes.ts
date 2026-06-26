export enum FjsErrorCode {
  FailedToCreateCharge = 'FailedToCreateCharge',
  AlreadyCreatedCharge = 'AlreadyCreatedCharge',
  // FJS already received the charge's cancellation — it is already deleted. Idempotent success for a refund.
  AlreadyDeletedCharge = 'AlreadyDeletedCharge',
}

export enum PaymentServiceCode {
  InvalidVerificationToken = 'InvalidVerificationToken',
  MissingVerification = 'MissingVerification',
  CouldNotCreatePaymentFlow = 'CouldNotCreatePaymentFlow',
  InvalidPayerNationalId = 'InvalidPayerNationalId',
  CompanyNotFound = 'CompanyNotFound',
  PersonNotFound = 'PersonNotFound',
  PaymentFlowNotFound = 'PaymentFlowNotFound',
  PaymentFlowAlreadyPaid = 'PaymentFlowAlreadyPaid',
  CouldNotVerifyCallback = 'CouldNotVerifyCallback',
  CouldNotCreatePaymentConfirmation = 'CouldNotCreatePaymentConfirmation',
  PaymentFlowAmountMismatch = 'PaymentFlowAmountMismatch',
  ChargeItemCodesNotFound = 'ChargeItemCodesNotFound',
  InvalidPaymentMethods = 'InvalidPaymentMethods',
  UpstreamNotificationFailure = 'UpstreamNotificationFailure',
  UnknownPaymentServiceError = 'UnknownPaymentServiceError',
  PaymentFlowNotEligibleToBeRefunded = 'PaymentFlowNotEligibleToBeRefunded',
  CouldNotDeletePaymentConfirmation = 'CouldNotDeletePaymentConfirmation',
  CouldNotDeletePaymentFulfillment = 'CouldNotDeletePaymentFulfillment',
}

export enum CardErrorCode {
  InsufficientFunds = 'InsufficientFunds',
  ExpiredCard = 'ExpiredCard',
  InvalidCardNumber = 'InvalidCardNumber',
  InvalidCardExpiry = 'InvalidCardExpiry',
  InvalidCardCVC = 'InvalidCardCVC',
  InvalidCard = 'InvalidCard',
  LostCard = 'LostCard',
  StolenCard = 'StolenCard',
  ClosedAccount = 'ClosedAccount',
  TransactionNotPermitted = 'TransactionNotPermitted',
  RestrictedCard = 'RestrictedCard',
  SuspectedFraud = 'SuspectedFraud',
  ExceedsWithdrawalLimit = 'ExceedsWithdrawalLimit',
  SecurityViolation = 'SecurityViolation',
  AdditionalAuthenticationRequired = 'AdditionalAuthenticationRequired',
  ContactIssuer = 'ContactIssuer',
  IssuerUnavailable = 'IssuerUnavailable',
  DuplicateTransaction = 'DuplicateTransaction',
  TransactionTimedOut = 'TransactionTimedOut',
  StopPaymentOrder = 'StopPaymentOrder',
  RevocationOfAuthorization = 'RevocationOfAuthorization',
  RevocationOfAllAuthorizations = 'RevocationOfAllAuthorizations',
  PaymentSystemUnavailable = 'PaymentSystemUnavailable',
  GenericDecline = 'GenericDecline',
  VerificationDeadlineExceeded = 'VerificationDeadlineExceeded',
  VerificationCancelledByUser = 'VerificationCancelledByUser',
  VerificationFailed = 'VerificationFailed',
  VerificationCallbackFailed = 'VerificationCallbackFailed',
  RefundedBecauseOfSystemError = 'RefundedBecauseOfSystemError',
  RefundFailedAfterPaymentError = 'RefundFailedAfterPaymentError',
  UnknownCardError = 'UnknownCardError',
  ErrorGettingApplePaySession = 'ErrorGettingApplePaySession',
  ApplePayNotConfigured = 'ApplePayNotConfigured',
  ApplePayReplayDetected = 'ApplePayReplayDetected',
  ApplePaySignatureVerificationFailed = 'ApplePaySignatureVerificationFailed',
}

export enum InvoiceErrorCode {
  FailedToCreateInvoice = 'FailedToCreateInvoice',
  FailedToCreateInvoiceConfirmation = 'FailedToCreateInvoiceConfirmation',
  InvoiceAlreadyExists = 'InvoiceAlreadyExists',
  UnsupportedCallbackStatus = 'UnsupportedCallbackStatus',
  UnknownInvoiceError = 'UnknownInvoiceError',
}

export enum BankTransferErrorCode {
  FailedToCreateBankTransfer = 'FailedToCreateBankTransfer',
  MissingBankAccountNumber = 'MissingBankAccountNumber',
  FailedToFetchBankTransfer = 'FailedToFetchBankTransfer',
  BankTransferAlreadyInProgress = 'BankTransferAlreadyInProgress',
  BankTransferNotFound = 'BankTransferNotFound',
  UnknownBankTransferError = 'UnknownBankTransferError',
  BankTransferRejected = 'BankTransferRejected',
  BankTransferCancelled = 'BankTransferCancelled',
  BankTransferGenericError = 'BankTransferGenericError',
  BankTransferExpired = 'BankTransferExpired',
}

export type PaymentErrorCode =
  | FjsErrorCode
  | CardErrorCode
  | InvoiceErrorCode
  | BankTransferErrorCode
  | PaymentServiceCode
