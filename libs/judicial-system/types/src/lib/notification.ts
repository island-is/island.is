export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
  RECEIVED_BY_COURT = 'RECEIVED_BY_COURT',
  COURT_DATE = 'COURT_DATE',
  RULING = 'RULING',
  REVOKED = 'REVOKED',
}

export interface Notification {
  id: string
  created: string
  caseId: string
  type: NotificationType
  condition?: string
  recipients?: string
}

export interface SendNotification {
  type: NotificationType
}

export interface SendNotificationResponse {
  notificationSent: boolean
}
