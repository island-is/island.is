export enum NotificationType {
  User = 'UserNotification',
  Order = 'OrderNotification',
  /**
   * Notification sent for system-related events such as updates or stock changes.
   * @param {string} documentId - The ID of the documentId
   */
  System = 'SystemNotification',
}

export const NotificationConfig = {
  [NotificationType.User]: {
    templateId: 'USER_TEMPLATE_ID',
    keys: {} as { username: string; email: string },
  },
  [NotificationType.Order]: {
    templateId: 'ORDER_TEMPLATE_ID',
    keys: {} as { orderId: string; orderStatus: string },
  },
  [NotificationType.System]: {
    templateId: 'HNIPP.TEST.INBOX.TEMPLATE',
    keys: {} as { documentId: string },
  },
}

export type NotificationConfigType = typeof NotificationConfig
export type NotificationTypeKey = keyof typeof NotificationConfig
export type NotificationArgs<T extends NotificationTypeKey> =
  NotificationConfigType[T]['keys']

const sendNotification = <T extends NotificationType>(
  type: T,
  messageParties: {
    recipient: string
    sender?: string
  },
  args?: NotificationArgs<T>,
) => {
  const config = NotificationConfig[type]
  console.log(
    `Sending ${type} notification with templateId: ${config.templateId} and args:`,
    args,
  )
}
// Example usage
sendNotification(
  NotificationType.System,
  { recipient: 'recipient', sender: 'sender' },
  { documentId: 'læklsdæ' },
)
