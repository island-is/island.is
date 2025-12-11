import {
  RenderedNotificationDto,
  ActorNotificationDto,
} from '@island.is/clients/user-notification'
import {
  AdminNotification,
  Notification,
  ActorNotification,
} from '../lib/notifications.model'

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
export const adminNotificationMapper = (
  notification: RenderedNotificationDto,
): AdminNotification => ({
  id: notification.id,
  notificationId: notification.messageId,
  sent: notification.created,
  scope: notification.scope,
  sender: {
    id: notification.senderId,
  },
})

export const actorNotificationMapper = (
  notification: ActorNotificationDto,
): ActorNotification => ({
  id: notification.id,
  messageId: notification.messageId,
  rootMessageId: notification.rootMessageId,
  userNotificationId: notification.userNotificationId,
  recipient: {
    nationalId: notification.recipient,
  },
  onBehalfOfNationalId: {
    nationalId: notification.onBehalfOfNationalId,
  },
  scope: notification.scope,
  created: notification.created,
})
