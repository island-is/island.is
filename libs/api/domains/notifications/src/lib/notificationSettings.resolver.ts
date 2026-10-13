import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { notificationScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  NotificationSettingsService,
  toCategoryKey,
} from './notificationSettings.service'
import {
  NotificationCategoriesInput,
  NotificationSettings,
} from './notificationSettings.model'
import { AUDIT_NAMESPACE } from './notifications.resolver'
import type { Locale } from '@island.is/shared/types'

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
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<NotificationSettings> {
    try {
      return await this.service.getNotificationSettings(user, locale)
    } catch (e) {
      this.logger.info('failed to get notification settings', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }
  }

  @Mutation(() => Boolean, { name: 'blockNotificationCategories' })
  async blockNotificationCategories(
    @CurrentUser() user: User,
    @Args('input') input: NotificationCategoriesInput,
  ): Promise<boolean> {
    try {
      await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'blockNotificationCategories',
          resources: input.categories.map(({ senderId, category }) =>
            toCategoryKey(senderId, category),
          ),
        },
        this.service.blockCategories(user, input.categories),
      )
    } catch (e) {
      this.logger.info('failed to block notification categories', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return true
  }

  @Mutation(() => Boolean, { name: 'unblockNotificationCategories' })
  async unblockNotificationCategories(
    @CurrentUser() user: User,
    @Args('input') input: NotificationCategoriesInput,
  ): Promise<boolean> {
    try {
      await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'unblockNotificationCategories',
          resources: input.categories.map(({ senderId, category }) =>
            toCategoryKey(senderId, category),
          ),
        },
        this.service.unblockCategories(user, input.categories),
      )
    } catch (e) {
      this.logger.info('failed to unblock notification categories', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return true
  }
}
