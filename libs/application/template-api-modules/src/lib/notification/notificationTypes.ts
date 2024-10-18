import { NotificationConfig, NotificationType } from './notificationsTemplates'

export type NotificationConfigType = typeof NotificationConfig
export type NotificationTypeKey = keyof typeof NotificationConfig
export type NotificationArgs<T extends NotificationTypeKey> =
  NotificationConfigType[T]['keys']
