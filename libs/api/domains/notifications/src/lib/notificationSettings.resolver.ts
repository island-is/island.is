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
  NotificationCategoryInput,
  NotificationSettings,
  UpdateNotificationCategoriesInput,
} from './notificationSettings.model'
import { AUDIT_NAMESPACE } from './notifications.resolver'
import { Loader } from '@island.is/nest/dataloader'
import { OrganizationTitleByNationalIdLoader } from '@island.is/cms'
import type { OrganizationTitleByNationalIdDataLoader } from '@island.is/cms'
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
    @Loader(OrganizationTitleByNationalIdLoader)
    titleLoader: OrganizationTitleByNationalIdDataLoader,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<NotificationSettings> {
    try {
      return await this.service.getNotificationSettings(
        user,
        locale,
        titleLoader,
      )
    } catch (e) {
      this.logger.info('failed to get notification settings', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }
  }

  @Mutation(() => NotificationSettings, {
    name: 'updateNotificationCategorySettings',
  })
  async updateNotificationCategorySettings(
    @CurrentUser() user: User,
    @Loader(OrganizationTitleByNationalIdLoader)
    titleLoader: OrganizationTitleByNationalIdDataLoader,
    @Args('input') input: UpdateNotificationCategoriesInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<NotificationSettings> {
    const categories = input.categories ?? []
    const keysWhere = (blocked: boolean) =>
      categories
        .filter((c) => c.blocked === blocked)
        .map(({ senderId, category }) => toCategoryKey(senderId, category))

    try {
      await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'updateNotificationCategorySettings',
          resources: categories.map(({ senderId, category }) =>
            toCategoryKey(senderId, category),
          ),
          meta: {
            blocked: keysWhere(true),
            unblocked: keysWhere(false),
            onlyActionablePriorityNotifications:
              input.onlyActionablePriorityNotifications,
          },
        },
        this.updateSettings(user, categories, input),
      )
    } catch (e) {
      this.logger.info('failed to update notification category settings', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return this.service.getNotificationSettings(user, locale, titleLoader)
  }

  private async updateSettings(
    user: User,
    categories: NotificationCategoryInput[],
    input: UpdateNotificationCategoriesInput,
  ): Promise<void> {
    await this.service.updateCategories(user, categories)
    if (typeof input.onlyActionablePriorityNotifications === 'boolean') {
      await this.service.updateOnlyActionablePriorityNotifications(
        user,
        input.onlyActionablePriorityNotifications,
      )
    }
  }
}
