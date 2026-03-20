import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { NotificationsApi } from '@island.is/clients/user-notification'
import type { Locale } from '@island.is/shared/types'
import {
  AdminNotificationsResponse,
  ActorNotificationsResponse,
  NotificationsInput,
} from './notifications.model'
import {
  adminNotificationMapper,
  actorNotificationMapper,
} from '../utils/helpers'

@Injectable()
export class NotificationsAdminService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private notificationsApi: NotificationsApi,
  ) {}

  notificationsWAuth(auth: Auth) {
    return this.notificationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getNotifications(
    locale: Locale,
    nationalId: string,
    user: User,
    input?: NotificationsInput,
  ): Promise<AdminNotificationsResponse> {
    const notifications = await this.notificationsWAuth(
      user,
    ).notificationsControllerFindMany({
      xQueryNationalId: nationalId,
      locale,
      limit: input?.limit,
      before: input?.before,
      after: input?.after,
    })

    return {
      data: notifications.data
        ? notifications.data.map((item) => adminNotificationMapper(item))
        : [],
      totalCount: notifications.totalCount ?? 0,
      pageInfo: notifications.pageInfo ?? {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    }
  }

  async getActorNotifications(
    nationalId: string,
    user: User,
    input?: NotificationsInput,
  ): Promise<ActorNotificationsResponse> {
    const actorNotifications = await this.notificationsWAuth(
      user,
    ).notificationsControllerFindActorNotifications({
      xQueryNationalId: nationalId,
      limit: input?.limit,
      before: input?.before,
      after: input?.after,
    })

    return {
      data: actorNotifications.data
        ? actorNotifications.data.map((item) => actorNotificationMapper(item))
        : [],
      totalCount: actorNotifications.totalCount ?? 0,
      pageInfo: actorNotifications.pageInfo ?? {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    }
  }
}
