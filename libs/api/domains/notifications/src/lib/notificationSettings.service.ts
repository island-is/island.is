import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { UserNotificationApi } from '@island.is/clients/user-notification'
import { V2MeApi } from '@island.is/clients/user-profile'
import type { OrganizationTitleByNationalIdDataLoader } from '@island.is/cms'
import type { Locale } from '@island.is/shared/types'
import { BadRequestException, Injectable } from '@nestjs/common'
import {
  NotificationCategoryInput,
  NotificationSenderInput,
  NotificationSenderSetting,
  NotificationSettings,
} from './notificationSettings.model'
import {
  filterAndSortSenders,
  isValidSenderId,
  normalizeSenderId,
  toCategoryKey,
} from './notificationSettings.utils'

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
   * so they can be unblocked. Also returns the ids of the senders the user
   * has blocked, received from recently or not.
   */
  private async findCategorySettings(user: User): Promise<{
    settings: Map<string, CategorySetting>
    blockedSenders: Set<string>
  }> {
    const [{ categories }, { blockedCategories, blockedSenders }] =
      await Promise.all([
        this.userNotificationsWAuth(
          user,
        ).meNotificationsControllerFindCategories(),
        this.v2MeApiWAuth(
          user,
        ).meUserProfileControllerFindNotificationSettings(),
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

    return {
      settings,
      blockedSenders: new Set(
        blockedSenders.map(({ senderId }) => normalizeSenderId(senderId)),
      ),
    }
  }

  async getNotificationSettings(
    user: User,
    locale: Locale,
    titleLoader: OrganizationTitleByNationalIdDataLoader,
  ): Promise<NotificationSettings> {
    const [{ settings, blockedSenders }, userProfile] = await Promise.all([
      this.findCategorySettings(user),
      this.v2MeApiWAuth(user).meUserProfileControllerFindUserProfile(),
    ])

    const senders = new Map<string, NotificationSenderSetting>()
    for (const setting of settings.values()) {
      const sender = senders.get(setting.senderId) ?? {
        sender: { id: setting.senderId },
        categories: [],
        blocked: blockedSenders.has(setting.senderId),
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

    // Keep blocked senders the user no longer has categories from, so they
    // can still be unblocked
    for (const senderId of blockedSenders) {
      if (!senders.has(senderId)) {
        senders.set(senderId, {
          sender: { id: senderId },
          categories: [],
          blocked: true,
        })
      }
    }

    const senderIds = [...senders.keys()]
    const titleList = await Promise.all(
      senderIds.map((id) => titleLoader.load(id)),
    )
    const titles = Object.fromEntries(
      senderIds.map((id, i) => [id, titleList[i]]),
    )

    return {
      senders: filterAndSortSenders([...senders.values()], titles).map(
        (sender) => ({
          ...sender,
          categories: [...sender.categories].sort((a, b) =>
            a.label.localeCompare(b.label, 'is'),
          ),
        }),
      ),
      onlyActionablePriorityNotifications:
        userProfile.onlyActionablePriorityNotifications,
    }
  }

  async updateOnlyActionablePriorityNotifications(
    user: User,
    onlyActionablePriorityNotifications: boolean,
  ): Promise<void> {
    await this.v2MeApiWAuth(user).meUserProfileControllerPatchUserProfile({
      patchUserProfileDto: { onlyActionablePriorityNotifications },
    })
  }

  /**
   * Blocks or unblocks the given senders and sender categories in one call.
   * Only senders and categories the user has received, or already blocked,
   * can be blocked.
   */
  async updateSettings(
    user: User,
    {
      categories = [],
      senders = [],
    }: {
      categories?: NotificationCategoryInput[]
      senders?: NotificationSenderInput[]
    },
  ): Promise<void> {
    if (categories.length === 0 && senders.length === 0) {
      return
    }

    for (const { senderId } of [...categories, ...senders]) {
      if (!isValidSenderId(normalizeSenderId(senderId))) {
        throw new BadRequestException(`Sender id ${senderId} is not valid`)
      }
    }

    const { settings, blockedSenders } =
      categories.some(({ blocked }) => blocked) ||
      senders.some(({ blocked }) => blocked)
        ? await this.findCategorySettings(user)
        : {
            settings: new Map<string, CategorySetting>(),
            blockedSenders: new Set<string>(),
          }

    const categoryUpdates = categories.map(
      ({ senderId, category, blocked }) => {
        if (!blocked) {
          return { senderId, category, blocked }
        }

        const setting = settings.get(toCategoryKey(senderId, category))
        if (!setting) {
          throw new BadRequestException(
            `Unknown notification category ${toCategoryKey(
              senderId,
              category,
            )}`,
          )
        }

        return {
          senderId: setting.senderId,
          category: setting.category,
          categoryLabel: setting.categoryLabel,
          blocked,
        }
      },
    )

    const knownSenders = new Set([
      ...[...settings.values()].map(({ senderId }) => senderId),
      ...blockedSenders,
    ])
    const senderUpdates = senders.map(({ senderId, blocked }) => {
      const normalizedSenderId = normalizeSenderId(senderId)
      if (blocked && !knownSenders.has(normalizedSenderId)) {
        throw new BadRequestException(
          `Unknown notification sender ${normalizedSenderId}`,
        )
      }

      return { senderId: normalizedSenderId, blocked }
    })

    await this.v2MeApiWAuth(
      user,
    ).meUserProfileControllerUpdateNotificationSettings({
      updateNotificationSettingsDto: {
        categories: categoryUpdates,
        senders: senderUpdates,
      },
    })
  }
}
