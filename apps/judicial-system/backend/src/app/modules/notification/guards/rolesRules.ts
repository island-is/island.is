import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import {
  CaseNotificationType,
  UserRole,
} from '@island.is/judicial-system/types'

// Allows prosecutors to send notifications
export const prosecutorNotificationRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    CaseNotificationType.HEADS_UP,
    CaseNotificationType.READY_FOR_COURT,
    CaseNotificationType.APPEAL_CASE_FILES_UPDATED,
    CaseNotificationType.CASE_FILES_UPDATED,
  ],
} as RolesRule

// Allows defenders to send notifications
export const defenderNotificationRule: RolesRule = {
  role: UserRole.DEFENDER,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    CaseNotificationType.APPEAL_CASE_FILES_UPDATED,
    CaseNotificationType.CASE_FILES_UPDATED,
  ],
} as RolesRule

// Allows district court judges to send notifications
export const districtCourtJudgeNotificationRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    CaseNotificationType.COURT_DATE,
    CaseNotificationType.RULING_ORDER_ADDED,
  ],
}

// Allows district court registrars to send notifications
export const districtCourtRegistrarNotificationRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [CaseNotificationType.COURT_DATE],
}

// Allows district court assistants to send notifications
export const districtCourtAssistantNotificationRule: RolesRule = {
  role: UserRole.DISTRICT_COURT_ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [CaseNotificationType.COURT_DATE],
}

// Allows court of appeals judges to send notifiications
export const courtOfAppealsJudgeNotificationRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [CaseNotificationType.APPEAL_JUDGES_ASSIGNED],
}

// Allows court of appeals registrars to send notifications
export const courtOfAppealsRegistrarNotificationRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [CaseNotificationType.APPEAL_JUDGES_ASSIGNED],
}

// Allows court of appeals assistants to send notifications
export const courtOfAppealsAssistantNotificationRule: RolesRule = {
  role: UserRole.COURT_OF_APPEALS_ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [CaseNotificationType.APPEAL_JUDGES_ASSIGNED],
}
