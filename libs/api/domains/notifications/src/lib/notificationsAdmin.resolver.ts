import { Args, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'

import { NotificationsAdminService } from './notificationsAdmin.service'
import {
  NotificationsInput,
  AdminNotificationsResponse,
  ActorNotificationsResponse,
} from './notifications.model'
import type { Locale } from '@island.is/shared/types'

export const AUDIT_NAMESPACE = 'notifications-admin-resolver'

@UseGuards(IdsUserGuard)
@Resolver(() => AdminNotificationsResponse)
@Audit({ namespace: AUDIT_NAMESPACE })
export class NotificationsAdminResolver {
  constructor(private readonly service: NotificationsAdminService) {}

  @Query(() => AdminNotificationsResponse, {
    name: 'adminNotifications',
  })
  @Audit()
  async getNotifications(
    @Args('nationalId') nationalId: string,
    @Args('input', { type: () => NotificationsInput, nullable: true })
    input: NotificationsInput,
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<AdminNotificationsResponse> {
    return await this.service.getNotifications(locale, nationalId, user, input)
  }

  @Query(() => ActorNotificationsResponse, {
    name: 'adminActorNotifications',
  })
  @Audit()
  async getActorNotifications(
    @Args('nationalId') nationalId: string,
    @Args('input', { type: () => NotificationsInput, nullable: true })
    input: NotificationsInput,
    @CurrentUser() user: User,
  ): Promise<ActorNotificationsResponse> {
    return await this.service.getActorNotifications(nationalId, user, input)
  }
}
