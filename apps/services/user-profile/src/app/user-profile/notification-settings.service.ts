import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  CategoryLabelDto,
  UpdateNotificationCategoryDto,
} from './dto/blocked-category.dto'
import { ActorNotificationSettingsDto } from './dto/actor-notification-settings.dto'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { ActorBlockedNotification } from './models/actorBlockedNotification.model'
import { ActorProfile } from './models/actor-profile.model'
import { BlockedNotification } from './models/blockedNotification.model'
import {
  getDefaultActorEmailNotifications,
  UserProfileService,
} from './user-profile.service'
import { normalizeKennitala } from './utils/normalize-kennitala'

export const toCategoryKey = (senderId: string, category: string): string =>
  `${senderId}-${category}`

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectModel(BlockedNotification)
    private readonly blockedNotificationModel: typeof BlockedNotification,
    @InjectModel(ActorBlockedNotification)
    private readonly actorBlockedNotificationModel: typeof ActorBlockedNotification,
    @InjectModel(ActorProfile)
    private readonly actorProfileModel: typeof ActorProfile,
    private readonly userProfileService: UserProfileService,
    private readonly sequelize: Sequelize,
  ) {}

  async findSettings(nationalId: string): Promise<NotificationSettingsDto> {
    const blockedNotifications = await this.blockedNotificationModel.findAll({
      where: { nationalId },
      attributes: ['senderId', 'category', 'categoryLabel'],
      order: [
        ['created', 'ASC'],
        ['senderId', 'ASC'],
        ['category', 'ASC'],
      ],
    })

    return {
      nationalId,
      blockedCategories: blockedNotifications.map(
        ({ senderId, category, categoryLabel }) => ({
          key: toCategoryKey(senderId, category),
          senderId,
          category,
          categoryLabel,
        }),
      ),
    }
  }

  /**
   * Blocks or unblocks the given sender categories in a single transaction.
   * If a category is given more than once, the last entry wins.
   */
  async updateCategories(
    nationalId: string,
    categories: UpdateNotificationCategoryDto[],
  ): Promise<void> {
    const { toBlock, toUnblock } = this.splitUpdates(categories)

    if (toBlock.length === 0 && toUnblock.length === 0) {
      return
    }

    await this.sequelize.transaction(async (transaction) => {
      if (toBlock.length > 0) {
        await this.userProfileService.findOrCreateUserProfile(
          nationalId,
          transaction,
        )

        await this.blockedNotificationModel.bulkCreate(
          toBlock.map(({ senderId, category, categoryLabel }) => ({
            nationalId,
            senderId,
            category,
            categoryLabel,
          })),
          { ignoreDuplicates: true, transaction },
        )
      }

      if (toUnblock.length > 0) {
        await this.blockedNotificationModel.destroy({
          where: {
            nationalId,
            [Op.or]: toUnblock.map(({ senderId, category }) => ({
              senderId,
              category,
            })),
          },
          transaction,
        })
      }
    })
  }

  async findActorSettings(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<ActorNotificationSettingsDto> {
    const actorProfile = await this.actorProfileModel.findOne({
      where: { toNationalId, fromNationalId },
      attributes: ['id', 'onlyActionablePriorityNotifications'],
    })

    if (!actorProfile) {
      return {
        fromNationalId,
        blockedCategories: [],
        onlyActionablePriorityNotifications: false,
      }
    }

    const blockedNotifications =
      await this.actorBlockedNotificationModel.findAll({
        where: { actorProfileId: actorProfile.id },
        attributes: ['senderId', 'category', 'categoryLabel'],
        order: [
          ['created', 'ASC'],
          ['senderId', 'ASC'],
          ['category', 'ASC'],
        ],
      })

    return {
      fromNationalId,
      blockedCategories: blockedNotifications.map(
        ({ senderId, category, categoryLabel }) => ({
          key: toCategoryKey(senderId, category),
          senderId,
          category,
          categoryLabel,
        }),
      ),
      onlyActionablePriorityNotifications:
        actorProfile.onlyActionablePriorityNotifications,
    }
  }

  /**
   * Blocks or unblocks the given sender categories for an actor profile
   * (delegation) in a single transaction. The actor profile is created if
   * something is blocked and it does not exist yet; an existing one is never
   * modified.
   */
  async updateActorCategories(
    toNationalId: string,
    fromNationalId: string,
    categories: UpdateNotificationCategoryDto[],
  ): Promise<void> {
    await this.userProfileService.verifyIncomingDelegation(
      toNationalId,
      fromNationalId,
    )

    const { toBlock, toUnblock } = this.splitUpdates(categories)

    if (toBlock.length === 0 && toUnblock.length === 0) {
      return
    }

    await this.sequelize.transaction(async (transaction) => {
      let actorProfileId: string | undefined

      if (toBlock.length > 0) {
        const [actorProfile] = await this.actorProfileModel.findOrCreate({
          where: { toNationalId, fromNationalId },
          defaults: {
            toNationalId,
            fromNationalId,
            emailNotifications:
              getDefaultActorEmailNotifications(fromNationalId),
          },
          transaction,
        })
        actorProfileId = actorProfile.id

        await this.actorBlockedNotificationModel.bulkCreate(
          toBlock.map(({ senderId, category, categoryLabel }) => ({
            actorProfileId: actorProfile.id,
            senderId,
            category,
            categoryLabel,
          })),
          { ignoreDuplicates: true, transaction },
        )
      }

      if (toUnblock.length > 0) {
        actorProfileId ??= (
          await this.actorProfileModel.findOne({
            where: { toNationalId, fromNationalId },
            attributes: ['id'],
            transaction,
          })
        )?.id

        if (actorProfileId) {
          await this.actorBlockedNotificationModel.destroy({
            where: {
              actorProfileId,
              [Op.or]: toUnblock.map(({ senderId, category }) => ({
                senderId,
                category,
              })),
            },
            transaction,
          })
        }
      }
    })
  }

  /** Normalizes and dedupes (last wins), then splits into block/unblock */
  private splitUpdates(categories: UpdateNotificationCategoryDto[]) {
    const updates = this.dedupe(
      categories.map((category) => ({
        ...category,
        senderId: this.normalizeSenderId(category.senderId),
      })),
    )

    // UpdateNotificationCategoryDto requires a categoryLabel when blocking
    const toBlock = updates.filter(
      (update): update is typeof update & { categoryLabel: CategoryLabelDto } =>
        update.blocked,
    )
    const toUnblock = updates.filter(({ blocked }) => !blocked)

    return { toBlock, toUnblock }
  }

  private dedupe<T extends { senderId: string; category: string }>(
    items: T[],
  ): T[] {
    const byKey = new Map<string, T>()
    for (const item of items) {
      byKey.set(toCategoryKey(item.senderId, item.category), item)
    }

    return [...byKey.values()]
  }

  private normalizeSenderId(senderId: string): string {
    const normalizedSenderId = normalizeKennitala(senderId)

    if (!/^\d{10}$/.test(normalizedSenderId)) {
      throw new BadRequestException('Sender id is not valid')
    }

    return normalizedSenderId
  }
}
