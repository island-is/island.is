import { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import type { Locale } from '@island.is/shared/types'
import {
  MarkNotificationReadResponse,
  NotificationResponse,
  NotificationsInput,
  NotificationsResponse,
} from './notifications.model'
import {
  generateMockNotifications,
  getMockNotification,
  getMockNotifications,
  markMockNotificationRead,
  mockNotificationsResponse,
} from './notifications.mock'

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getNotifications(
    locale: Locale,
    user: User | null,
    input?: NotificationsInput,
  ): Promise<NotificationsResponse | null> {
    this.logger.debug('getting potential mocked notifications')
    let mockNotifications = getMockNotifications(locale, user)

    if (!mockNotifications) {
      this.logger.debug('no mock notifications found, generating')
      mockNotifications = generateMockNotifications(locale, user)
    }

    this.logger.debug('creating paged mock notifications response')
    const mockResponse: NotificationsResponse = mockNotificationsResponse(
      mockNotifications,
      input,
    )

    return Promise.resolve(mockResponse)
  }

  async getNotification(
    id: string,
    locale: Locale,
    user: User | null,
  ): Promise<NotificationResponse | null> {
    this.logger.debug('getting potential single mocked notification')
    const mockNotification = getMockNotification(locale, user, id)

    if (!mockNotification) {
      this.logger.debug('no mock notification found')
      return null
    }

    return Promise.resolve({ data: mockNotification })
  }

  async markNotificationAsRead(
    id: string,
    locale: Locale,
    user: User | null,
  ): Promise<MarkNotificationReadResponse | null> {
    this.logger.debug(
      'getting potential single mocked notification and marking as read',
    )
    const mockNotificationMarkedAsRead = markMockNotificationRead(
      locale,
      user,
      id,
    )

    if (!mockNotificationMarkedAsRead) {
      this.logger.debug('no mock notification found to mark as read')
      return null
    }

    return Promise.resolve({ data: mockNotificationMarkedAsRead })
  }
}
