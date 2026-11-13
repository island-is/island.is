import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { UserNotificationApi } from '@island.is/clients/user-notification'
import { V2ActorApi, V2MeApi } from '@island.is/clients/user-profile'
import type { OrganizationTitleByNationalIdDataLoader } from '@island.is/cms'
import type { Locale } from '@island.is/shared/types'
import { BadRequestException, Injectable } from '@nestjs/common'
import {
  NotificationCategoryInput,
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
   * category was renamed, so they can be unblocked.
   */
  private mergeCategorySettings(
    categories: CategoryEntry[],
    blockedCategories: CategoryEntry[],
  ): Map<string, CategorySetting> {
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

  private async findCategorySettings(
    user: User,
  ): Promise<Map<string, CategorySetting>> {
    const [{ categories }, { blockedCategories }] = await Promise.all([
      this.userNotificationsWAuth(
        user,
      ).meNotificationsControllerFindCategories(),
      this.v2MeApiWAuth(user).meUserProfileControllerFindNotificationSettings(),
    ])
    return this.mergeCategorySettings(categories, blockedCategories)
  }

  private async findActorCategorySettings(
    user: User,
    fromNationalId: string,
  ): Promise<{
    settings: Map<string, CategorySetting>
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
      settings: this.mergeCategorySettings(
        categories,
        actorSettings.blockedCategories,
      ),
      onlyActionablePriorityNotifications:
        actorSettings.onlyActionablePriorityNotifications,
    }
  }

  /**
   * Groups the settings by sender, looks up sender titles and sorts.
   */
  private async toNotificationSettings(
    settings: Map<string, CategorySetting>,
    locale: Locale,
    titleLoader: OrganizationTitleByNationalIdDataLoader,
    onlyActionablePriorityNotifications: boolean,
  ): Promise<NotificationSettings> {
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
      this.findCategorySettings(user),
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
      await this.findActorCategorySettings(user, fromNationalId)
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
   * Validates the requested changes and resolves blocked categories against
   * the known ones. Returns undefined when there is nothing to update.
   */
  private async buildCategoryUpdates(
    categories: NotificationCategoryInput[],
    findSettings: () => Promise<Map<string, CategorySetting>>,
  ) {
    if (categories.length === 0) {
      return undefined
    }

    for (const { senderId } of categories) {
      if (!isValidSenderId(normalizeSenderId(senderId))) {
        throw new BadRequestException(`Sender id ${senderId} is not valid`)
      }
    }

    const settings = categories.some(({ blocked }) => blocked)
      ? await findSettings()
      : new Map<string, CategorySetting>()

    return categories.map(({ senderId, category, blocked }) => {
      if (!blocked) {
        return { senderId, category, blocked }
      }
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
        blocked,
      }
    })
  }

  /**
   * Blocks or unblocks the given sender categories.
   */
  async updateCategories(
    user: User,
    categories: NotificationCategoryInput[],
  ): Promise<void> {
    const updates = await this.buildCategoryUpdates(categories, () =>
      this.findCategorySettings(user),
    )
    if (!updates) {
      return
    }

    await this.v2MeApiWAuth(
      user,
    ).meUserProfileControllerUpdateNotificationSettings({
      updateNotificationSettingsDto: { categories: updates },
    })
  }

  /**
   * Blocks or unblocks the given sender categories for an incoming delegation.
   */
  async updateActorCategories(
    user: User,
    fromNationalId: string,
    categories: NotificationCategoryInput[],
  ): Promise<void> {
    const updates = await this.buildCategoryUpdates(
      categories,
      async () =>
        (
          await this.findActorCategorySettings(user, fromNationalId)
        ).settings,
    )
    if (!updates) {
      return
    }

    await this.v2ActorApiWAuth(
      user,
    ).actorUserProfileControllerUpdateActorNotificationSettings({
      xParamFromNationalId: fromNationalId,
      updateNotificationSettingsDto: { categories: updates },
    })
  }
}
