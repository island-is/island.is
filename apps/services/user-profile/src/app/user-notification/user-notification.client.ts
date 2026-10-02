import { Inject, Injectable } from '@nestjs/common'

import type { Auth } from '@island.is/auth-nest-tools'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { UserProfileUserNotificationConfig } from './user-notification.config'

export interface NotificationSender {
  senderId: string
}

interface NotificationSendersResponse {
  senders?: NotificationSender[]
}

/**
 * Minimal client for the parts of the user-notification API used by this service.
 *
 * `@island.is/clients/user-notification` is intentionally not used: the user-notification
 * service depends on `@island.is/clients/user-profile`, whose codegen depends on this
 * service's OpenAPI schema, so depending on the generated client here would create a
 * cycle in the nx codegen task graph.
 */
@Injectable()
export class UserNotificationClient {
  private readonly fetch = createEnhancedFetch({
    name: 'user-profile-user-notification',
    organizationSlug: 'stafraent-island',
  })

  constructor(
    @Inject(UserProfileUserNotificationConfig.KEY)
    private readonly config: ConfigType<
      typeof UserProfileUserNotificationConfig
    >,
  ) {}

  /**
   * Returns the distinct senders of notifications the authenticated user has received.
   */
  async findSenders(auth: Auth): Promise<NotificationSender[]> {
    const response = await this.fetch(
      `${this.config.basePath}/v1/me/notifications/senders`,
      {
        auth,
        headers: {
          authorization: auth.authorization,
          accept: 'application/json',
        },
      },
    )
    const body = (await response.json()) as NotificationSendersResponse

    return body.senders ?? []
  }
}
