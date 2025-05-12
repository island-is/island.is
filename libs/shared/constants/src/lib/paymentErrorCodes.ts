export enum FjsErrorCode {
  FailedToCreateCharge = 'FailedToCreateCharge',
  AlreadyCreatedCharge = 'AlreadyCreatedCharge',
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
  UnknownPaymentServiceError = 'UnknownPaymentServiceError',
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
  UnknownCardError = 'UnknownCardError',
}

export enum InvoiceErrorCode {
  FailedToCreateInvoice = 'FailedToCreateInvoice',
  InvoiceAlreadyExists = 'InvoiceAlreadyExists',
  UnknownInvoiceError = 'UnknownInvoiceError',
}

export type PaymentErrorCode =
  | FjsErrorCode
  | CardErrorCode
  | InvoiceErrorCode
  | PaymentServiceCode
