// Categories of messages that can be suspended together. Suspension is toggled
// per category, so all message types mapped to the same category are suspended
// and resumed as a unit. Defined here in the shared types library so the web
// and api layers can use it without depending on the SQS-backed message lib.
export enum MessageSuspensionCategory {
  COURT = 'COURT',
  COURT_OF_APPEALS = 'COURT_OF_APPEALS',
  POLICE = 'POLICE',
  NATIONAL_COMMISSIONERS_OFFICE = 'NATIONAL_COMMISSIONERS_OFFICE',
}
