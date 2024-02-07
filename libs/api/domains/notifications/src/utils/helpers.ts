import { RenderedNotificationDto } from '@island.is/clients/user-notification'
import { Notification } from '../lib/notifications.model'

export const notificationMapper = (
  notification: RenderedNotificationDto,
): Notification => ({
  id: notification.id,
  notificationId: notification.messageId,
  metadata: {
    sent: notification.created,
    created: notification.created,
    updated: notification.updated,
    status: notification.status,
  },
  sender: {
    name: '',
    logo: '',
  },
  recipient: {
    nationalId: undefined,
  },
  message: {
    title: notification.title,
    body: notification.body,
    link: {
      uri: notification.clickAction,
    },
  },
})
