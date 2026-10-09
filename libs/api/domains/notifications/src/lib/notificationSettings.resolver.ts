import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { notificationScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { NotificationSettingsService } from './notificationSettings.service'
import {
  NotificationSenderInput,
  NotificationSettings,
} from './notificationSettings.model'
import { AUDIT_NAMESPACE } from './notifications.resolver'

const LOG_CATEGORY = 'notification-settings-resolver'

@UseGuards(IdsUserGuard)
@Resolver()
@Audit({ namespace: AUDIT_NAMESPACE })
@Scopes(...notificationScopes)
export class NotificationSettingsResolver {
  constructor(
    private readonly service: NotificationSettingsService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => NotificationSettings, { name: 'userNotificationSettings' })
  @Audit()
  async getNotificationSettings(
    @CurrentUser() user: User,
  ): Promise<NotificationSettings> {
    try {
      return await this.service.getNotificationSettings(user)
    } catch (e) {
      this.logger.info('failed to get notification settings', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }
  }

  @Mutation(() => Boolean, { name: 'blockNotificationSender' })
  async blockNotificationSender(
    @CurrentUser() user: User,
    @Args('input') input: NotificationSenderInput,
  ): Promise<boolean> {
    try {
      await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'blockNotificationSender',
          resources: input.senderId,
        },
        this.service.blockSender(user, input.senderId),
      )
    } catch (e) {
      this.logger.info('failed to block notification sender', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return true
  }

  @Mutation(() => Boolean, { name: 'unblockNotificationSender' })
  async unblockNotificationSender(
    @CurrentUser() user: User,
    @Args('input') input: NotificationSenderInput,
  ): Promise<boolean> {
    try {
      await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'unblockNotificationSender',
          resources: input.senderId,
        },
        this.service.unblockSender(user, input.senderId),
      )
    } catch (e) {
      this.logger.info('failed to unblock notification sender', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return true
  }
}
