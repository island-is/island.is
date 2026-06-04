import { MessageType } from './message'

// Categories of messages that can be suspended together. Suspension is toggled
// per category, so all message types mapped to the same category are suspended
// and resumed as a unit.
export enum MessageSuspensionCategory {
  COURT = 'COURT',
  COURT_OF_APPEALS = 'COURT_OF_APPEALS',
  POLICE = 'POLICE',
  NATIONAL_COMMISSIONERS_OFFICE = 'NATIONAL_COMMISSIONERS_OFFICE',
}

// Explicit mapping from message type to suspension category. We deliberately do
// not derive this from message type name prefixes at runtime: the prefixes
// overlap (`DELIVERY_TO_COURT_OF_APPEALS_*` also starts with
// `DELIVERY_TO_COURT_`) and an explicit map keeps category membership reviewable
// and decoupled from naming. Message types that are absent from this map cannot
// be suspended.
export const messageTypeToSuspensionCategory: Partial<
  Record<MessageType, MessageSuspensionCategory>
> = {
  [MessageType.DELIVERY_TO_COURT_PROSECUTOR]: MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_DEFENDANT]: MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_INDICTMENT]: MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_INDICTMENT_INFO]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_INDICTMENT_ARRAIGNMENT_DATE]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_INDICTMENT_DEFENDER]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_CASE_FILE]: MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_CASE_FILES_RECORD]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_REQUEST]: MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_SUBPOENA]: MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_COURT_RECORD]: MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_COURT_RECORD_WORKING_DOCUMENT]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_SIGNED_COURT_RECORD]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_SIGNED_RULING]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_CASE_CONCLUSION]:
    MessageSuspensionCategory.COURT,
  [MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE]:
    MessageSuspensionCategory.COURT_OF_APPEALS,
  [MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES]:
    MessageSuspensionCategory.COURT_OF_APPEALS,
  [MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE]:
    MessageSuspensionCategory.COURT_OF_APPEALS,
  [MessageType.DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION]:
    MessageSuspensionCategory.COURT_OF_APPEALS,
  [MessageType.DELIVERY_TO_POLICE_CASE]: MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_INDICTMENT_CASE]:
    MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_INDICTMENT]: MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_CASE_FILE]: MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_CASE_FILES_RECORD]:
    MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE]:
    MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_SIGNED_COURT_RECORD]:
    MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_SIGNED_RULING]:
    MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_POLICE_APPEAL]: MessageSuspensionCategory.POLICE,
  [MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA]:
    MessageSuspensionCategory.NATIONAL_COMMISSIONERS_OFFICE,
  [MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA_REVOCATION]:
    MessageSuspensionCategory.NATIONAL_COMMISSIONERS_OFFICE,
  [MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT]:
    MessageSuspensionCategory.NATIONAL_COMMISSIONERS_OFFICE,
}

// Returns the suspension category for a message type, or undefined if the type
// cannot be suspended.
export const getMessageSuspensionCategory = (
  type: MessageType,
): MessageSuspensionCategory | undefined =>
  messageTypeToSuspensionCategory[type]

// The outcome of checking whether a message should currently be suspended. When
// suspended, the message is re-queued after delaySeconds without being handled.
export interface SuspensionDecision {
  suspend: boolean
  delaySeconds: number
}
