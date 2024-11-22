import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { NotificationsApi } from '@island.is/clients/user-notification'
import type { Locale } from '@island.is/shared/types'
import {
  AdminNotificationsResponse,
  NotificationsInput,
} from './notifications.model'
import { adminNotificationMapper } from '../utils/helpers'

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
  ): Promise<AdminNotificationsResponse | null> {
    this.logger.debug('getting potential admin notifications')

    const notifications = await this.notificationsWAuth(
      user,
    ).notificationsControllerFindMany({
      xQueryNationalId: nationalId,
      locale,
      limit: input?.limit,
      before: input?.before,
      after: input?.after,
    })

    if (!notifications.data) {
      this.logger.debug('no notification found')
      return null
    }

    return {
      data: notifications.data.map((item) => adminNotificationMapper(item)),
      totalCount: notifications.totalCount,
      pageInfo: notifications.pageInfo,
    }
  }
}
