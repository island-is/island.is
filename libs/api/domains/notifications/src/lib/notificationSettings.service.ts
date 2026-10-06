import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { UserNotificationApi } from '@island.is/clients/user-notification'
import { V2MeApi } from '@island.is/clients/user-profile'
import { Injectable } from '@nestjs/common'
import { NotificationSettings } from './notificationSettings.model'

@Injectable()
export class NotificationSettingsService {
  constructor(
    private userNotificationApi: UserNotificationApi,
    private v2MeApi: V2MeApi,
  ) {}

  private userNotificationsWAuth(auth: Auth) {
    return this.userNotificationApi.withMiddleware(new AuthMiddleware(auth))
  }

  private v2MeApiWAuth(auth: Auth) {
    return this.v2MeApi.withMiddleware(new AuthMiddleware(auth))
  }

  /**
   * Combines the senders the user has received notifications from with the
   * senders the user has blocked. Blocked senders are included even if the
   * user hasn't received notifications from them, so they can be unblocked.
   */
  async getNotificationSettings(user: User): Promise<NotificationSettings> {
    const [{ senders }, { blockedSenders }] = await Promise.all([
      this.userNotificationsWAuth(user).meNotificationsControllerFindSenders(),
      this.v2MeApiWAuth(user).meUserProfileControllerFindNotificationSettings(),
    ])

    const blockedSenderIds = new Set(
      blockedSenders.map((blockedSender) => blockedSender.senderId),
    )
    const senderIds = new Set([
      ...senders.map((sender) => sender.senderId),
      ...blockedSenderIds,
    ])

    return {
      senders: [...senderIds].map((senderId) => ({
        sender: { id: senderId },
        blocked: blockedSenderIds.has(senderId),
      })),
    }
  }

  async blockSender(user: User, senderId: string): Promise<void> {
    await this.v2MeApiWAuth(
      user,
    ).meUserProfileControllerBlockNotificationSender({
      createBlockedSenderDto: { senderId },
    })
  }

  async unblockSender(user: User, senderId: string): Promise<void> {
    await this.v2MeApiWAuth(
      user,
    ).meUserProfileControllerUnblockNotificationSender({ senderId })
  }
}
