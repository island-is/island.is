import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  AppealCaseNotificationType,
  RequestCaseNotificationType,
  UserRole,
} from '@island.is/judicial-system/types'

// Allows prosecutors to send notifications
export const prosecutorNotificationRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    RequestCaseNotificationType.HEADS_UP,
    RequestCaseNotificationType.READY_FOR_COURT,
    RequestCaseNotificationType.CASE_FILES_UPDATED,
  ],
} as RolesRule

// Allows defenders to send notifications
export const defenderNotificationRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [RequestCaseNotificationType.CASE_FILES_UPDATED],
} as RolesRule

// Allows prosecutors to send appeal case notifications
export const prosecutorAppealNotificationRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED],
} as RolesRule

// Allows defenders to send appeal case notifications
export const defenderAppealNotificationRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED],
} as RolesRule

// Allows district court judges to send notifications
export const districtCourtJudgeNotificationRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [RequestCaseNotificationType.COURT_DATE],
}

// Allows district court registrars to send notifications
export const districtCourtRegistrarNotificationRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [RequestCaseNotificationType.COURT_DATE],
}

// Allows district court assistants to send notifications
export const districtCourtAssistantNotificationRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [RequestCaseNotificationType.COURT_DATE],
}
