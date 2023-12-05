import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser, User } from '@island.is/auth-nest-tools'
import { Inject, NotFoundException, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import {
  MarkNotificationReadResponse,
  NotificationResponse,
  NotificationsInput,
  NotificationsResponse,
} from './notifications.model'
import { Locale } from '@island.is/shared/types'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'notifications-resolver'

@Resolver()
@UseGuards(IdsUserGuard)
export class NotificationsResolver {
  constructor(
    private readonly service: NotificationsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => NotificationsResponse, {
    name: 'notifications',
    nullable: true,
  })
  async getNotifications(
    @CurrentUser() user: User,
    @Args('input', { type: () => NotificationsInput, nullable: true })
    input: NotificationsInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    let notifications

    try {
      notifications = await this.service.getNotifications(locale, user, input)
    } catch (e) {
      this.logger.error('failed to get notifications', {
        locale,
        category: LOG_CATEGORY,
      })
      throw e
    }

    return notifications
  }

  @Query(() => NotificationResponse, {
    name: 'notification',
    nullable: true,
  })
  async getNotification(
    @CurrentUser() user: User,
    @Args('notificationId', { type: () => String, nullable: false })
    notificationId: string,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    let notification
    try {
      notification = await this.service.getNotification(
        notificationId,
        locale,
        user,
      )
    } catch (e) {
      this.logger.error('failed to get notification by id', {
        notificationId,
        locale,
        category: LOG_CATEGORY,
      })
      throw e
    }

    if (!notification) {
      this.logger.info('notification not found', {
        notificationId,
        locale,
        category: LOG_CATEGORY,
      })
      throw new NotFoundException('notification not found')
    }

    return notification
  }

  @Mutation(() => MarkNotificationReadResponse, {
    name: 'markNotificationAsRead',
    nullable: true,
  })
  async markNotificationAsRead(
    @CurrentUser() user: User,
    @Args('notificationId', { type: () => String, nullable: false })
    notificationId: string,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    let result

    try {
      result = await this.service.markNotificationAsRead(
        notificationId,
        locale,
        user,
      )
    } catch (e) {
      this.logger.error('failed to mark notification as read', {
        notificationId,
        locale,
        category: LOG_CATEGORY,
      })
      throw e
    }

    if (!result) {
      throw new NotFoundException('notification not found')
    }

    return result
  }
}
