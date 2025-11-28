import { Args, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'

import { NotificationsAdminService } from './notificationsAdmin.service'
import {
  NotificationsInput,
  AdminNotificationsResponse,
  ActorNotificationsResponse,
} from './notifications.model'
import type { Locale } from '@island.is/shared/types'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'notification-admin-resolver'
export const AUDIT_NAMESPACE = 'notifications-admin-resolver'

@UseGuards(IdsUserGuard)
@Resolver(() => AdminNotificationsResponse)
@Audit({ namespace: AUDIT_NAMESPACE })
export class NotificationsAdminResolver {
  constructor(
    private readonly service: NotificationsAdminService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => AdminNotificationsResponse, {
    name: 'adminNotifications',
    nullable: true,
  })
  @Audit()
  async getNotifications(
    @Args('nationalId') nationalId: string,
    @Args('input', { type: () => NotificationsInput, nullable: true })
    input: NotificationsInput,
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<AdminNotificationsResponse | null> {
    let notifications: AdminNotificationsResponse | null

    try {
      notifications = await this.service.getNotifications(
        locale,
        nationalId,
        user,
        input,
      )
    } catch (e) {
      this.logger.error('failed to get admin notifications', {
        locale,
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return notifications
  }

  @Query(() => ActorNotificationsResponse, {
    name: 'adminActorNotifications',
    nullable: true,
  })
  @Audit()
  async getActorNotifications(
    @Args('nationalId') nationalId: string,
    @Args('input', { type: () => NotificationsInput, nullable: true })
    input: NotificationsInput,
    @CurrentUser() user: User,
  ): Promise<ActorNotificationsResponse | null> {
    let actorNotifications: ActorNotificationsResponse | null

    try {
      actorNotifications = await this.service.getActorNotifications(
        nationalId,
        user,
        input,
      )
    } catch (e) {
      this.logger.error('failed to get admin actor notifications', {
        category: LOG_CATEGORY,
        error: e,
      })
      throw e
    }

    return actorNotifications
  }
}
