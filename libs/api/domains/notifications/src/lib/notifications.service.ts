import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { UserNotificationApi } from '@island.is/clients/user-notification'
import type { Locale } from '@island.is/shared/types'
import {
  NotificationsMarkAllAsSeenResponse,
  MarkNotificationReadResponse,
  NotificationResponse,
  NotificationsInput,
  NotificationsResponse,
  NotificationsUnreadCount,
  NotificationsUnseenCount,
  NotificationsMarkAllAsReadResponse,
} from './notifications.model'
import { notificationMapper } from '../utils/helpers'

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private userNotificationApi: UserNotificationApi,
  ) {}

  userNotificationsWAuth(auth: Auth) {
    return this.userNotificationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getNotifications(
    locale: Locale,
    user: User,
    input?: NotificationsInput,
  ): Promise<NotificationsResponse | null> {
    this.logger.debug('getting potential notifications')
    const notifications = await this.userNotificationsWAuth(
      user,
    ).meNotificationsControllerFindMany({
      locale,
      limit: input?.limit,
      before: input?.before,
      after: input?.after,
    })

    if (!notifications.data) {
      this.logger.debug('no notification found')
      return null
    }

    return {
      data: notifications.data.map((item) => notificationMapper(item)),
      totalCount: notifications.totalCount,
      pageInfo: notifications.pageInfo,
    }
  }

  async getNotification(
    id: number,
    locale: Locale,
    user: User,
  ): Promise<NotificationResponse | null> {
    this.logger.debug('getting potential single notification')
    const notification = await this.userNotificationsWAuth(
      user,
    ).meNotificationsControllerFindOne({ locale, id })

    if (!notification) {
      this.logger.debug('no notification found')
      return null
    }

    return { data: notificationMapper(notification) }
  }

  async markAllNotificationsAsSeen(
    user: User,
  ): Promise<NotificationsMarkAllAsSeenResponse | null> {
    this.logger.debug('marking all notifications as seen')

    await this.userNotificationsWAuth(
      user,
    ).meNotificationsControllerMarkAllAsSeen()

    return {
      success: true,
    }
  }

  async markAllNotificationsAsRead(
    user: User,
  ): Promise<NotificationsMarkAllAsReadResponse | null> {
    this.logger.debug('marking all notifications as read')

    await this.userNotificationsWAuth(
      user,
    ).meNotificationsControllerMarkAllAsRead()

    return {
      success: true,
    }
  }

  async getUnreadCount(user: User): Promise<NotificationsUnreadCount | null> {
    this.logger.debug('getting unread count')

    const res = await this.userNotificationsWAuth(
      user,
    ).meNotificationsControllerGetUnreadNotificationsCount()

    return res
  }

  async getUnseenCount(user: User): Promise<NotificationsUnseenCount | null> {
    this.logger.debug('getting unseen count')

    const res = await this.userNotificationsWAuth(
      user,
    ).meNotificationsControllerGetUnseenNotificationsCount()

    return res
  }

  async markNotificationAsRead(
    id: number,
    locale: Locale,
    user: User,
  ): Promise<MarkNotificationReadResponse | null> {
    this.logger.debug(
      'getting potential single notification and marking as read',
    )
    const notification = await this.userNotificationsWAuth(
      user,
    ).meNotificationsControllerUpdate({
      locale,
      id,
      updateNotificationDto: {
        read: true,
        seen: true,
      },
    })

    if (!notification) {
      this.logger.debug('no notification found to mark as read')
      return null
    }

    return { data: notificationMapper(notification) }
  }
}
