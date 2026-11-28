import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { UserNotificationApi } from '@island.is/clients/user-notification'
import { V2ActorApi, V2MeApi } from '@island.is/clients/user-profile'
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

type CategoryEntry = Pick<
  CategorySetting,
  'senderId' | 'category' | 'categoryLabel'
>

interface CategorySetting {
  key: string
  senderId: string
  category: string
  categoryLabel: CategoryLabel
  blocked: boolean
}

interface Settings {
  categories: Map<string, CategorySetting>
  /** Normalized ids of the blocked senders */
  blockedSenders: Set<string>
}

@Injectable()
export class NotificationSettingsService {
  constructor(
    private userNotificationApi: UserNotificationApi,
    private v2MeApi: V2MeApi,
    private v2ActorApi: V2ActorApi,
  ) {}

  private userNotificationsWAuth(auth: Auth) {
    return this.userNotificationApi.withMiddleware(new AuthMiddleware(auth))
  }

  private v2MeApiWAuth(auth: Auth) {
    return this.v2MeApi.withMiddleware(new AuthMiddleware(auth))
  }

  private v2ActorApiWAuth(auth: Auth) {
    return this.v2ActorApi.withMiddleware(new AuthMiddleware(auth))
  }

  /**
   * Combines the sender categories received with the categories blocked.
   * Blocked categories are included even if none were received, e.g. after a
   * category was renamed, so they can be unblocked. Blocked senders are
   * returned whether they have been received from recently or not.
   */
  private mergeSettings(
    categories: CategoryEntry[],
    blockedCategories: CategoryEntry[],
    blockedSenders: { senderId: string }[],
  ): Settings {
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
      categories: settings,
      blockedSenders: new Set(
        blockedSenders.map(({ senderId }) => normalizeSenderId(senderId)),
      ),
    }
  }

  private async findSettings(user: User): Promise<Settings> {
    const [{ categories }, { blockedCategories, blockedSenders }] =
      await Promise.all([
        this.userNotificationsWAuth(
          user,
        ).meNotificationsControllerFindCategories(),
        this.v2MeApiWAuth(
          user,
        ).meUserProfileControllerFindNotificationSettings(),
      ])
    return this.mergeSettings(categories, blockedCategories, blockedSenders)
  }

  private async findActorSettings(
    user: User,
    fromNationalId: string,
  ): Promise<{
    settings: Settings
    onlyActionablePriorityNotifications: boolean
  }> {
    const [{ categories }, actorSettings] = await Promise.all([
      this.userNotificationsWAuth(
        user,
      ).meNotificationsControllerFindActorCategories({
        xParamFromNationalId: fromNationalId,
      }),
      this.v2ActorApiWAuth(
        user,
      ).actorUserProfileControllerFindActorNotificationSettings({
        xParamFromNationalId: fromNationalId,
      }),
    ])
    return {
      settings: this.mergeSettings(
        categories,
        actorSettings.blockedCategories,
        actorSettings.blockedSenders,
      ),
      onlyActionablePriorityNotifications:
        actorSettings.onlyActionablePriorityNotifications,
    }
  }

  /**
   * Groups the settings by sender, looks up sender titles and sorts.
   */
  private async toNotificationSettings(
    { categories, blockedSenders }: Settings,
    locale: Locale,
    titleLoader: OrganizationTitleByNationalIdDataLoader,
    onlyActionablePriorityNotifications: boolean,
  ): Promise<NotificationSettings> {
    const senders = new Map<string, NotificationSenderSetting>()
    for (const setting of categories.values()) {
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

    // Keep blocked senders without categories received or blocked, so they
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
      onlyActionablePriorityNotifications,
    }
  }

  async getNotificationSettings(
    user: User,
    locale: Locale,
    titleLoader: OrganizationTitleByNationalIdDataLoader,
  ): Promise<NotificationSettings> {
    const [settings, userProfile] = await Promise.all([
      this.findSettings(user),
      this.v2MeApiWAuth(user).meUserProfileControllerFindUserProfile(),
    ])
    return this.toNotificationSettings(
      settings,
      locale,
      titleLoader,
      userProfile.onlyActionablePriorityNotifications,
    )
  }

  async getActorNotificationSettings(
    user: User,
    fromNationalId: string,
    locale: Locale,
    titleLoader: OrganizationTitleByNationalIdDataLoader,
  ): Promise<NotificationSettings> {
    const { settings, onlyActionablePriorityNotifications } =
      await this.findActorSettings(user, fromNationalId)
    return this.toNotificationSettings(
      settings,
      locale,
      titleLoader,
      onlyActionablePriorityNotifications,
    )
  }

  async updateOnlyActionablePriorityNotifications(
    user: User,
    onlyActionablePriorityNotifications: boolean,
  ): Promise<void> {
    await this.v2MeApiWAuth(user).meUserProfileControllerPatchUserProfile({
      patchUserProfileDto: { onlyActionablePriorityNotifications },
    })
  }

  async updateActorOnlyActionablePriorityNotifications(
    user: User,
    fromNationalId: string,
    onlyActionablePriorityNotifications: boolean,
  ): Promise<void> {
    await this.v2ActorApiWAuth(
      user,
    ).actorUserProfileControllerCreateOrUpdateActorProfile({
      xParamFromNationalId: fromNationalId,
      patchActorProfileDto: { onlyActionablePriorityNotifications },
    })
  }

  /**
   * Validates the requested changes and resolves them against the known
   * senders and categories: only senders and categories that were received,
   * or are already blocked, can be blocked. Returns undefined when there is
   * nothing to update.
   */
  private async buildUpdates(
    {
      categories = [],
      senders = [],
    }: {
      categories?: NotificationCategoryInput[]
      senders?: NotificationSenderInput[]
    },
    findSettings: () => Promise<Settings>,
  ) {
    if (categories.length === 0 && senders.length === 0) {
      return undefined
    }

    for (const { senderId } of [...categories, ...senders]) {
      if (!isValidSenderId(normalizeSenderId(senderId))) {
        throw new BadRequestException(`Sender id ${senderId} is not valid`)
      }
    }

    const settings: Settings =
      categories.some(({ blocked }) => blocked) ||
      senders.some(({ blocked }) => blocked)
        ? await findSettings()
        : { categories: new Map(), blockedSenders: new Set() }

    const categoryUpdates = categories.map(
      ({ senderId, category, blocked }) => {
        if (!blocked) {
          return { senderId, category, blocked }
        }
        const setting = settings.categories.get(
          toCategoryKey(senderId, category),
        )
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
      ...[...settings.categories.values()].map(({ senderId }) => senderId),
      ...settings.blockedSenders,
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

    return { categories: categoryUpdates, senders: senderUpdates }
  }

  /**
   * Blocks or unblocks the given senders and sender categories in one call.
   */
  async updateSettings(
    user: User,
    input: {
      categories?: NotificationCategoryInput[]
      senders?: NotificationSenderInput[]
    },
  ): Promise<void> {
    const updates = await this.buildUpdates(input, () =>
      this.findSettings(user),
    )
    if (!updates) {
      return
    }

    await this.v2MeApiWAuth(
      user,
    ).meUserProfileControllerUpdateNotificationSettings({
      updateNotificationSettingsDto: updates,
    })
  }

  /**
   * Blocks or unblocks the given senders and sender categories for an
   * incoming delegation in one call.
   */
  async updateActorSettings(
    user: User,
    fromNationalId: string,
    input: {
      categories?: NotificationCategoryInput[]
      senders?: NotificationSenderInput[]
    },
  ): Promise<void> {
    const updates = await this.buildUpdates(
      input,
      async () => (await this.findActorSettings(user, fromNationalId)).settings,
    )
    if (!updates) {
      return
    }

    await this.v2ActorApiWAuth(
      user,
    ).actorUserProfileControllerUpdateActorNotificationSettings({
      xParamFromNationalId: fromNationalId,
      updateNotificationSettingsDto: updates,
    })
  }
}
