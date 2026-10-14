import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { UserNotificationApi } from '@island.is/clients/user-notification'
import { V2MeApi } from '@island.is/clients/user-profile'
import type { Locale } from '@island.is/shared/types'
import { BadRequestException, Injectable } from '@nestjs/common'
import {
  NotificationCategoryInput,
  NotificationSenderSetting,
  NotificationSettings,
} from './notificationSettings.model'
import { normalizeSenderId, toCategoryKey } from './notificationSettings.utils'

interface CategoryLabel {
  is: string
  en?: string
}

interface CategorySetting {
  key: string
  senderId: string
  category: string
  categoryLabel: CategoryLabel
  blocked: boolean
}

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
   * Combines the sender categories the user has received notifications in
   * with the categories the user has blocked. Blocked categories are included
   * even if the user hasn't received them, e.g. after a category was renamed,
   * so they can be unblocked.
   */
  private async findCategorySettings(
    user: User,
  ): Promise<Map<string, CategorySetting>> {
    const [{ categories }, { blockedCategories }] = await Promise.all([
      this.userNotificationsWAuth(
        user,
      ).meNotificationsControllerFindCategories(),
      this.v2MeApiWAuth(user).meUserProfileControllerFindNotificationSettings(),
    ])

    const settings = new Map<string, CategorySetting>()
    for (const { senderId, category, categoryLabel } of categories) {
      const key = toCategoryKey(senderId, category)
      settings.set(key, {
        key,
        senderId: normalizeSenderId(senderId),
        category,
        categoryLabel,
        blocked: false,
      })
    }

    for (const { senderId, category, categoryLabel } of blockedCategories) {
      const key = toCategoryKey(senderId, category)
      const received = settings.get(key)
      settings.set(key, {
        key,
        senderId: normalizeSenderId(senderId),
        category,
        // Prefer the latest label from received notifications
        categoryLabel: received?.categoryLabel ?? categoryLabel,
        blocked: true,
      })
    }

    return settings
  }

  async getNotificationSettings(
    user: User,
    locale: Locale,
  ): Promise<NotificationSettings> {
    const settings = await this.findCategorySettings(user)

    const senders = new Map<string, NotificationSenderSetting>()
    for (const setting of settings.values()) {
      const sender = senders.get(setting.senderId) ?? {
        sender: { id: setting.senderId },
        categories: [],
      }
      sender.categories.push({
        key: setting.key,
        category: setting.category,
        label:
          locale === 'en'
            ? setting.categoryLabel.en ?? setting.categoryLabel.is
            : setting.categoryLabel.is,
        blocked: setting.blocked,
      })
      senders.set(setting.senderId, sender)
    }

    return { senders: [...senders.values()] }
  }

  /**
   * Blocks or unblocks the given sender categories. Blocked categories are
   * validated before anything is written.
   */
  async updateCategories(
    user: User,
    categories: NotificationCategoryInput[],
  ): Promise<void> {
    const toBlock = categories.filter(({ blocked }) => blocked)
    const toUnblock = categories.filter(({ blocked }) => !blocked)

    if (toBlock.length > 0) {
      await this.blockCategories(user, toBlock)
    }
    if (toUnblock.length > 0) {
      await this.unblockCategories(user, toUnblock)
    }
  }

  /**
   * Blocks the given sender categories. Only categories the user has received
   * or already blocked can be blocked, and their labels are taken from there.
   */
  private async blockCategories(
    user: User,
    categories: NotificationCategoryInput[],
  ): Promise<void> {
    const settings = await this.findCategorySettings(user)

    const blockCategories = categories.map(({ senderId, category }) => {
      const setting = settings.get(toCategoryKey(senderId, category))
      if (!setting) {
        throw new BadRequestException(
          `Unknown notification category ${toCategoryKey(senderId, category)}`,
        )
      }

      return {
        senderId: setting.senderId,
        category: setting.category,
        categoryLabel: setting.categoryLabel,
      }
    })

    await this.v2MeApiWAuth(
      user,
    ).meUserProfileControllerBlockNotificationCategories({
      blockCategoriesDto: { categories: blockCategories },
    })
  }

  private async unblockCategories(
    user: User,
    categories: NotificationCategoryInput[],
  ): Promise<void> {
    await this.v2MeApiWAuth(
      user,
    ).meUserProfileControllerUnblockNotificationCategories({
      unblockCategoriesDto: {
        categories: categories.map(({ senderId, category }) => ({
          senderId,
          category,
        })),
      },
    })
  }
}
