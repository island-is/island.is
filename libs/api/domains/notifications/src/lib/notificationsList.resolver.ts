import {
  Args,
  Context,
  Int,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'
import { OrganizationLogoLoader } from '@island.is/cms'
import type { LogoUrl, OrganizationLogoDataLoader } from '@island.is/cms'
import { NotificationsService } from './notifications.service'
import {
  NotificationSender,
  NotificationsInput,
  NotificationsResponse,
} from './notifications.model'
import type { Locale } from '@island.is/shared/types'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Loader } from '@island.is/nest/dataloader'
import { AUDIT_NAMESPACE } from './notifications.resolver'
import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { DocumentsScope } from '@island.is/auth/scopes'

const LOG_CATEGORY = 'notification-list-resolver'

@UseGuards(IdsUserGuard)
@Resolver(() => NotificationsResponse)
@Audit({ namespace: AUDIT_NAMESPACE })
@Scopes(DocumentsScope.main)
@FeatureFlag(Features.ServicePortalNotificationsEnabled)
export class NotificationsListResolver {
  constructor(
    private readonly service: NotificationsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => NotificationsResponse, {
    name: 'userNotifications',
    nullable: true,
  })
  @Audit()
  async getNotifications(
    @CurrentUser() user: User,
    @Args('input', { type: () => NotificationsInput, nullable: true })
    input: NotificationsInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<NotificationsResponse | null> {
    let notifications: NotificationsResponse | null

    try {
      notifications = await this.service.getNotifications(locale, user, input)
    } catch (e) {
      this.logger.error('failed to get notifications', {
        locale,
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return notifications
  }

  @ResolveField('unseenCount', () => Int, {
    nullable: true,
  })
  async resolveNotificationsUnseenCount(
    @Context('req') { user }: { user: User },
  ): Promise<number | undefined> {
    const res = await this.service.getUnseenCount(user)
    return res?.unseenCount
  }

  @ResolveField('unreadCount', () => Int, {
    nullable: true,
  })
  async resolveNotificationsUnreadCount(
    @Context('req') { user }: { user: User },
  ): Promise<number | undefined> {
    const res = await this.service.getUnreadCount(user)
    return res?.unreadCount
  }
}

@UseGuards(IdsUserGuard)
@Resolver(() => NotificationSender)
export class NotificationSenderResolver {
  @ResolveField('logoUrl', () => String, { nullable: true })
  async resolveOrganisationLogoUrl(
    @Loader(OrganizationLogoLoader)
    organizationLogoLoader: OrganizationLogoDataLoader,
    @Parent() sender: NotificationSender,
  ): Promise<LogoUrl | undefined> {
    return organizationLogoLoader.load({
      key: sender?.id ?? '',
      field: 'kennitala',
    })
  }
}
