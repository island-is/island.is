import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { notificationScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { NotificationSettingsService } from './notificationSettings.service'
import { toCategoryKey } from './notificationSettings.utils'
import {
  NotificationSettings,
  UpdateNotificationCategoriesInput,
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

  @Mutation(() => Boolean, { name: 'updateNotificationCategorySettings' })
  async updateNotificationCategorySettings(
    @CurrentUser() user: User,
    @Args('input') input: UpdateNotificationCategoriesInput,
  ): Promise<boolean> {
    const keysWhere = (blocked: boolean) =>
      input.categories
        .filter((c) => c.blocked === blocked)
        .map(({ senderId, category }) => toCategoryKey(senderId, category))

    try {
      await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'updateNotificationCategorySettings',
          resources: input.categories.map(({ senderId, category }) =>
            toCategoryKey(senderId, category),
          ),
          meta: { blocked: keysWhere(true), unblocked: keysWhere(false) },
        },
        this.service.updateCategories(user, input.categories),
      )
    } catch (e) {
      this.logger.info('failed to update notification category settings', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return true
  }
}
