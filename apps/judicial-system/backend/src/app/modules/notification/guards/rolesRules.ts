import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { NotificationType, UserRole } from '@island.is/judicial-system/types'

// Allows prosecutors to send notifications
export const prosecutorNotificationRule: RolesRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [NotificationType.HEADS_UP, NotificationType.READY_FOR_COURT],
} as RolesRule

// Allows judges to send notifiications
export const judgeNotificationRule: RolesRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.COURT_DATE,
    NotificationType.DEFENDER_ASSIGNED,
    NotificationType.APPEAL_JUDGES_ASSIGNED,
  ],
}

// Allows registrars to send notifications
export const registrarNotificationRule: RolesRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.COURT_DATE,
    NotificationType.DEFENDER_ASSIGNED,
    NotificationType.APPEAL_JUDGES_ASSIGNED,
  ],
}

// Allows assistants to send notifications
export const assistantNotificationRule: RolesRule = {
  role: UserRole.ASSISTANT,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.COURT_DATE,
    NotificationType.DEFENDER_ASSIGNED,
    NotificationType.APPEAL_JUDGES_ASSIGNED,
  ],
}
