export enum FjsErrorCode {
  AlreadyPaid = 'fjs_already_paid',
}

export enum PaymentServiceCode {
  InvalidVerificationToken = 'payment-service_invalid_verification_token',
  MissingVerification = 'payment-service_missing_verification',
  CouldNotCreatePaymentFlow = 'payment-service_could_not_create_payment_flow',
  InvalidPayerNationalId = 'payment-service_invalid_payer_national_id',
  CompanyNotFound = 'payment-service_company_not_found',
  PersonNotFound = 'payment-service_person_not_found',
  PaymentFlowNotFound = 'payment-service_payment_flow_not_found',
  PaymentFlowAlreadyPaid = 'payment-service_payment_flow_already_paid',
  CouldNotVerifyCallback = 'payment-service_could_not_verify_callback',
}

export enum CardErrorCode {
  InsufficientFunds = 'card_insufficient_funds',
  ExpiredCard = 'card_expired_card',
  InvalidCardNumber = 'card_invalid_card_number',
  InvalidCardExpiry = 'card_invalid_card_expiry',
  InvalidCardCVC = 'card_invalid_card_cvc',
  InvalidCard = 'card_invalid_card',
  LostCard = 'card_lost_card',
  StolenCard = 'card_stolen_card',
  ClosedAccount = 'card_closed_account',
  TransactionNotPermitted = 'card_transaction_not_permitted',
  RestrictedCard = 'card_restricted_card',
  SuspectedFraud = 'card_suspected_fraud',
  ExceedsWithdrawalLimit = 'card_exceeds_withdrawal_limit',
  SecurityViolation = 'card_security_violation',
  AdditionalAuthenticationRequired = 'card_additional_authentication_required',
  ContactIssuer = 'card_contact_issuer',
  IssuerUnavailable = 'card_issuer_unavailable',
  DuplicateTransaction = 'card_duplicate_transaction',
  TransactionTimedOut = 'card_transaction_timed_out',
  StopPaymentOrder = 'card_stop_payment_order',
  RevocationOfAuthorization = 'card_revocation_of_authorization',
  RevocationOfAllAuthorizations = 'card_revocation_of_all_authorizations',
  PaymentSystemUnavailable = 'card_payment_system_unavailable',
  GenericDecline = 'card_generic_decline',
  VerificationDeadlineExceeded = 'card_verification_deadline_exceeded',
  Unknown = 'card_unknown',
}
