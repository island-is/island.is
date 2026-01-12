import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import { DocumentsScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Inject, NotFoundException, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import {
  NotificationsMarkAllAsSeenResponse,
  MarkNotificationReadResponse,
  NotificationResponse,
  NotificationsMarkAllAsReadResponse,
} from './notifications.model'
import type { Locale } from '@island.is/shared/types'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'notifications-resolver'
export const AUDIT_NAMESPACE = 'notifications-resolver'

@UseGuards(IdsUserGuard)
@Resolver()
@Audit({ namespace: AUDIT_NAMESPACE })
@Scopes(DocumentsScope.main)
export class NotificationsResolver {
  constructor(
    private readonly service: NotificationsService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => NotificationResponse, {
    name: 'userNotification',
    nullable: true,
  })
  async getNotification(
    @CurrentUser() user: User,
    @Args('id', { type: () => Number, nullable: false })
    id: number,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    let notification
    try {
      notification = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'getNotification',
          resources: `${id}`,
        },
        this.service.getNotification(id, locale, user),
      )
    } catch (e) {
      this.logger.info('failed to get notification by id', {
        id,
        locale,
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    if (!notification) {
      this.logger.info('notification not found', {
        id,
        locale,
        category: LOG_CATEGORY,
      })
      throw new NotFoundException('notification not found')
    }

    return notification
  }

  @Mutation(() => NotificationsMarkAllAsSeenResponse, {
    name: 'markAllNotificationsSeen',
    nullable: true,
  })
  @Audit()
  async markAllNotificationsAsSeen(@CurrentUser() user: User) {
    let result

    try {
      result = await this.service.markAllNotificationsAsSeen(user)
    } catch (e) {
      this.logger.info('failed to mark all notifications as seen', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return result
  }

  @Mutation(() => NotificationsMarkAllAsReadResponse, {
    name: 'markAllNotificationsRead',
    nullable: true,
  })
  @Audit()
  async markAllNotificationsAsRead(@CurrentUser() user: User) {
    let result

    try {
      result = await this.service.markAllNotificationsAsRead(user)
    } catch (e) {
      this.logger.info('failed to mark all notifications as read', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return result
  }

  @Mutation(() => MarkNotificationReadResponse, {
    name: 'markNotificationAsRead',
    nullable: true,
  })
  async markNotificationAsRead(
    @CurrentUser() user: User,
    @Args('id', { type: () => Number, nullable: false })
    id: number,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    let result

    try {
      result = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'getNotification',
          resources: `${id}`,
        },
        this.service.markNotificationAsRead(id, locale, user),
      )
    } catch (e) {
      this.logger.info('failed to mark notification as read', {
        id,
        locale,
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    if (!result) {
      throw new NotFoundException('notification not found')
    }

    return result
  }
}
