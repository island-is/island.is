import {
  Args,
  Context,
  Int,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import {
  NotificationsInput,
  NotificationsResponse,
} from './notifications.model'
import type { Locale } from '@island.is/shared/types'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'notification-list-resolver'

@UseGuards(IdsUserGuard)
@Resolver(() => NotificationsResponse)
export class NotificationsListResolver {
  constructor(
    private readonly service: NotificationsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => NotificationsResponse, {
    name: 'userNotifications',
    nullable: true,
  })
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
