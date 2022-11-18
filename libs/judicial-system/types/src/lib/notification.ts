export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
  RECEIVED_BY_COURT = 'RECEIVED_BY_COURT',
  COURT_DATE = 'COURT_DATE',
  RULING = 'RULING',
  MODIFIED = 'MODIFIED',
  REVOKED = 'REVOKED',
  DEFENDER_ASSIGNED = 'DEFENDER_ASSIGNED',
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
