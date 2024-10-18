import { RenderedNotificationDto } from '@island.is/clients/user-notification'
import { Notification } from '../lib/notifications.model'

const cleanString = (str?: string) => {
  if (!str) {
    return ''
  }
  return str.replace(/\s+/g, ' ').trim()
}

export const notificationMapper = (
  notification: RenderedNotificationDto,
): Notification => ({
  id: notification.id,
  notificationId: notification.messageId,
  metadata: {
    sent: notification.created,
    created: notification.created,
    updated: notification.updated,
    read: notification.read,
    seen: notification.seen,
  },
  sender: {
    id: notification.senderId,
  },
  recipient: {
    nationalId: undefined,
  },
  message: {
    title: cleanString(notification.title),
    body: cleanString(notification.externalBody),
    dataCopy: notification.internalBody
      ? cleanString(notification.internalBody)
      : undefined,
    displayBody: cleanString(
      notification.internalBody ?? notification.externalBody,
    ),
    link: {
      url: notification.clickActionUrl,
    },
  },
})
