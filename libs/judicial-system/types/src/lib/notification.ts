export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
  RECEIVED_BY_COURT = 'RECEIVED_BY_COURT',
  COURT_DATE = 'COURT_DATE',
  RULING = 'RULING',
  MODIFIED = 'MODIFIED',
  REVOKED = 'REVOKED',
  DEFENDER_ASSIGNED = 'DEFENDER_ASSIGNED',
  DEFENDANTS_NOT_UPDATED_AT_COURT = 'DEFENDANTS_NOT_UPDATED_AT_COURT',
  APPEAL_TO_COURT_OF_APPEALS = 'APPEAL_TO_COURT_OF_APPEALS',
  APPEAL_RECEIVED_BY_COURT = 'APPEAL_RECEIVED_BY_COURT',
  APPEAL_STATEMENT = 'APPEAL_STATEMENT',
  APPEAL_COMPLETED = 'APPEAL_COMPLETED',
  APPEAL_JUDGES_ASSIGNED = 'APPEAL_JUDGES_ASSIGNED',
}

export interface Recipient {
  success: boolean
  address?: string
}

export interface Notification {
  id: string
  created: string
  caseId: string
  type: NotificationType
  recipients: Recipient[]
}

export interface SendNotification {
  type: NotificationType
}

export interface SendNotificationResponse {
  notificationSent: boolean
}
