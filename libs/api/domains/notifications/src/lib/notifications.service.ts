import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  UpdateNotificationDtoStatusEnum,
  UserNotificationApi,
} from '@island.is/clients/user-notification'
import type { Locale } from '@island.is/shared/types'
import {
  MarkNotificationReadResponse,
  NotificationResponse,
  NotificationsInput,
  NotificationsResponse,
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
      before: input?.first ? String(input?.first) : undefined,
      after: input?.after ? String(input?.after) : undefined,
    })

    this.logger.info({ notifications })

    if (!notifications.data) {
      this.logger.debug('no notification found')
      return null
    }

    return {
      data: notifications.data.map((item) => notificationMapper(item)),
      messageCounts: {
        totalCount: notifications.totalCount,
        unreadCount: undefined, // TODO: Not currently returned
      },
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
        status: UpdateNotificationDtoStatusEnum.Read,
      },
    })

    if (!notification) {
      this.logger.debug('no notification found to mark as read')
      return null
    }

    return { data: notificationMapper(notification) }
  }
}
