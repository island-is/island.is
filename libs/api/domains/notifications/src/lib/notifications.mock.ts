/**
 * Temp mock data for notifications domain, to be replaced with real client.
 */
import { User } from '@island.is/auth-nest-tools'
import {
  Notification,
  NotificationStatus,
  NotificationsInput,
  NotificationsResponse,
} from './notifications.model'
import { Locale } from '@island.is/shared/types'
import { faker } from '@island.is/shared/mocking'

type MockKey = string

const generated: Map<MockKey, Notification[]> = new Map()

const DEFAULT_MOCK_COUNT = 100
const PAGE_SIZE = 10

const toBase64 = (input: string) => Buffer.from(input).toString('base64')

const decodeBase64 = (input: string) =>
  Buffer.from(input, 'base64').toString('ascii')

function generateKey(user: User | null, locale: Locale): MockKey {
  const key = `${user?.nationalId ?? 'anon'}-${locale}`

  return key
}

export function generateMockNotification(user: User | null): Notification {
  const uuid = faker.datatype.uuid()
  const isRead = faker.datatype.boolean()
  const sent = faker.date.past()

  return {
    notificationId: uuid,
    metadata: {
      sent,
      read: isRead ? faker.date.between(sent, new Date()) : undefined,
      status: isRead ? NotificationStatus.READ : NotificationStatus.UNREAD,
    },
    sender: {
      name: faker.company.companyName(),
      logo: undefined,
    },
    recipient: {
      nationalId: user?.nationalId ?? '0000000000',
    },
    message: {
      title: faker.lorem.sentence(),
      body: faker.lorem.lines(2),
      link: {
        uri: `islandis://documents/${uuid}`,
      },
    },
  }
}

export function getMockNotifications(
  locale: Locale,
  user: User | null,
): Notification[] | null {
  const key: MockKey = generateKey(user, locale)

  const cached = generated.get(key)

  return cached ?? null
}

export function generateMockNotifications(
  locale: Locale,
  user: User | null,
  count: number = DEFAULT_MOCK_COUNT,
): Notification[] {
  const data = Array.from({ length: count }, () =>
    generateMockNotification(user),
  )

  const key = generateKey(user, locale)
  generated.set(key, data)

  return data
}

export function mockNotificationsResponse(
  notifications: Notification[],
  paging?: NotificationsInput,
): NotificationsResponse {
  const totalCount = notifications.length
  const unreadCount = notifications.filter(
    (notification) =>
      notification.metadata.status === NotificationStatus.UNREAD,
  ).length

  const after = paging?.after ? decodeBase64(paging.after) : undefined

  const indexOfAfterItem = after
    ? notifications.findIndex(
        (notification) => notification.notificationId === after,
      ) + 1
    : 0

  const pageSize = paging?.first ?? PAGE_SIZE

  const paginated = notifications.slice(
    indexOfAfterItem,
    indexOfAfterItem + pageSize,
  )

  const startCursor = paginated[0]?.notificationId
    ? toBase64(paginated[0].notificationId)
    : undefined
  const endCursor = paginated[paginated.length - 1]?.notificationId
    ? toBase64(paginated[paginated.length - 1].notificationId)
    : undefined
  const hasNextPage = indexOfAfterItem + pageSize < totalCount
  const hasPreviousPage = indexOfAfterItem > 0

  return {
    data: paginated,
    messageCounts: {
      totalCount,
      unreadCount,
    },
    totalCount,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    },
  }
}

export function getMockNotification(
  locale: Locale,
  user: User | null,
  notificationId: string,
): Notification | null {
  const notifications = generated.get(generateKey(user, locale))

  return (
    notifications?.find(
      (notification) => notification.notificationId === notificationId,
    ) ?? null
  )
}

export function markMockNotificationRead(
  locale: Locale,
  user: User | null,
  notificationId: string,
): Notification | null {
  const key = generateKey(user, locale)

  const notifications = generated.get(key)

  if (!notifications) {
    return null
  }

  const notification = notifications?.find(
    (notification) => notification.notificationId === notificationId,
  )

  if (!notification) {
    return null
  }

  notification.metadata.read = new Date()
  notification.metadata.status = NotificationStatus.READ

  generated.set(key, notifications)

  return notification
}
