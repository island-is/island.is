import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { notificationScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { NotificationSettingsService } from './notificationSettings.service'
import {
  getErrorMessage,
  normalizeSenderId,
  toCategoryKey,
} from './notificationSettings.utils'
import {
  NotificationCategoryInput,
  NotificationSenderInput,
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
    private readonly featureFlagService: FeatureFlagService,
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
        error: getErrorMessage(e),
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
    const senders = input.senders ?? []

    // Checked here rather than with @FeatureFlag, which would gate category
    // settings too
    if (senders.length > 0) {
      const sendersEnabled = await this.featureFlagService.getValue(
        Features.isNotificationBlockedSendersEnabled,
        false,
        user,
      )
      if (!sendersEnabled) {
        throw new BadRequestException('Blocking senders is not enabled')
      }
    }

    const keysWhere = (blocked: boolean) =>
      categories
        .filter((c) => c.blocked === blocked)
        .map(({ senderId, category }) => toCategoryKey(senderId, category))
    const sendersWhere = (blocked: boolean) =>
      senders
        .filter((s) => s.blocked === blocked)
        .map(({ senderId }) => normalizeSenderId(senderId))

    try {
      await this.auditService.auditPromise(
        {
          auth: user,
          namespace: AUDIT_NAMESPACE,
          action: 'updateNotificationCategorySettings',
          resources: [
            ...categories.map(({ senderId, category }) =>
              toCategoryKey(senderId, category),
            ),
            ...senders.map(({ senderId }) => normalizeSenderId(senderId)),
          ],
          meta: {
            blocked: keysWhere(true),
            unblocked: keysWhere(false),
            blockedSenders: sendersWhere(true),
            unblockedSenders: sendersWhere(false),
            onlyActionablePriorityNotifications:
              input.onlyActionablePriorityNotifications,
          },
        },
        this.updateSettings(user, categories, senders, input),
      )
    } catch (e) {
      this.logger.info('failed to update notification category settings', {
        category: LOG_CATEGORY,
        error: getErrorMessage(e),
      })
      throw e
    }

    try {
      return await this.service.getNotificationSettings(
        user,
        locale,
        titleLoader,
      )
    } catch (e) {
      // The update was already applied and audited, so don't report failure.
      this.logger.warn(
        'failed to read notification settings after successful update',
        {
          category: LOG_CATEGORY,
          error: getErrorMessage(e),
        },
      )
      return {
        senders: [],
        onlyActionablePriorityNotifications:
          input.onlyActionablePriorityNotifications,
      }
    }
  }

  private async updateSettings(
    user: User,
    categories: NotificationCategoryInput[],
    senders: NotificationSenderInput[],
    input: UpdateNotificationCategoriesInput,
  ): Promise<void> {
    await this.service.updateSettings(user, { categories, senders })
    if (typeof input.onlyActionablePriorityNotifications === 'boolean') {
      try {
        await this.service.updateOnlyActionablePriorityNotifications(
          user,
          input.onlyActionablePriorityNotifications,
        )
      } catch (e) {
        // The two writes hit separate endpoints and cannot be made atomic, so
        // make it explicit that the sender and category changes were already
        // applied.
        this.logger.error('partial notification settings update', {
          category: LOG_CATEGORY,
          error: getErrorMessage(e),
        })
        throw new InternalServerErrorException(
          categories.length > 0 || senders.length > 0
            ? 'Notification settings were updated, but updating onlyActionablePriorityNotifications failed'
            : 'Updating onlyActionablePriorityNotifications failed',
        )
      }
    }
  }
}
