import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  CategoryLabelDto,
  UpdateNotificationCategoryDto,
} from './dto/blocked-category.dto'
import { UpdateNotificationSenderDto } from './dto/blocked-sender.dto'
import { ActorNotificationSettingsDto } from './dto/actor-notification-settings.dto'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { ActorBlockedNotification } from './models/actorBlockedNotification.model'
import { ActorBlockedNotificationSender } from './models/actorBlockedNotificationSender.model'
import { ActorProfile } from './models/actor-profile.model'
import { BlockedNotification } from './models/blockedNotification.model'
import { BlockedNotificationSender } from './models/blockedNotificationSender.model'
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
    @InjectModel(BlockedNotificationSender)
    private readonly blockedNotificationSenderModel: typeof BlockedNotificationSender,
    @InjectModel(ActorBlockedNotification)
    private readonly actorBlockedNotificationModel: typeof ActorBlockedNotification,
    @InjectModel(ActorBlockedNotificationSender)
    private readonly actorBlockedNotificationSenderModel: typeof ActorBlockedNotificationSender,
    @InjectModel(ActorProfile)
    private readonly actorProfileModel: typeof ActorProfile,
    private readonly userProfileService: UserProfileService,
    private readonly sequelize: Sequelize,
  ) {}

  async findSettings(nationalId: string): Promise<NotificationSettingsDto> {
    const [blockedNotifications, blockedSenders] = await Promise.all([
      this.blockedNotificationModel.findAll({
        where: { nationalId },
        attributes: ['senderId', 'category', 'categoryLabel'],
        order: [
          ['created', 'ASC'],
          ['senderId', 'ASC'],
          ['category', 'ASC'],
        ],
      }),
      this.blockedNotificationSenderModel.findAll({
        where: { nationalId },
        attributes: ['senderId'],
        order: [
          ['created', 'ASC'],
          ['senderId', 'ASC'],
        ],
      }),
    ])

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
      blockedSenders: blockedSenders.map(({ senderId }) => ({ senderId })),
    }
  }

  /**
   * Blocks or unblocks the given senders and sender categories in a single
   * transaction. If a sender or category is given more than once, the last
   * entry wins. Sender blocks leave category blocks untouched.
   */
  async updateSettings(
    nationalId: string,
    {
      categories = [],
      senders = [],
    }: {
      categories?: UpdateNotificationCategoryDto[]
      senders?: UpdateNotificationSenderDto[]
    },
  ): Promise<void> {
    const { toBlock: categoriesToBlock, toUnblock: categoriesToUnblock } =
      this.splitCategoryUpdates(categories)
    const { toBlock: sendersToBlock, toUnblock: sendersToUnblock } =
      this.splitSenderUpdates(senders)

    if (
      categoriesToBlock.length === 0 &&
      categoriesToUnblock.length === 0 &&
      sendersToBlock.length === 0 &&
      sendersToUnblock.length === 0
    ) {
      return
    }

    await this.sequelize.transaction(async (transaction) => {
      if (categoriesToBlock.length > 0 || sendersToBlock.length > 0) {
        await this.userProfileService.findOrCreateUserProfile(
          nationalId,
          transaction,
        )
      }

      if (categoriesToBlock.length > 0) {
        await this.blockedNotificationModel.bulkCreate(
          categoriesToBlock.map(({ senderId, category, categoryLabel }) => ({
            nationalId,
            senderId,
            category,
            categoryLabel,
          })),
          { ignoreDuplicates: true, transaction },
        )
      }

      if (categoriesToUnblock.length > 0) {
        await this.blockedNotificationModel.destroy({
          where: {
            nationalId,
            [Op.or]: categoriesToUnblock.map(({ senderId, category }) => ({
              senderId,
              category,
            })),
          },
          transaction,
        })
      }

      if (sendersToBlock.length > 0) {
        await this.blockedNotificationSenderModel.bulkCreate(
          sendersToBlock.map(({ senderId }) => ({ nationalId, senderId })),
          { ignoreDuplicates: true, transaction },
        )
      }

      if (sendersToUnblock.length > 0) {
        await this.blockedNotificationSenderModel.destroy({
          where: {
            nationalId,
            senderId: sendersToUnblock.map(({ senderId }) => senderId),
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
        blockedSenders: [],
        onlyActionablePriorityNotifications: false,
      }
    }

    const [blockedNotifications, blockedSenders] = await Promise.all([
      this.actorBlockedNotificationModel.findAll({
        where: { actorProfileId: actorProfile.id },
        attributes: ['senderId', 'category', 'categoryLabel'],
        order: [
          ['created', 'ASC'],
          ['senderId', 'ASC'],
          ['category', 'ASC'],
        ],
      }),
      this.actorBlockedNotificationSenderModel.findAll({
        where: { actorProfileId: actorProfile.id },
        attributes: ['senderId'],
        order: [
          ['created', 'ASC'],
          ['senderId', 'ASC'],
        ],
      }),
    ])

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
      blockedSenders: blockedSenders.map(({ senderId }) => ({ senderId })),
      onlyActionablePriorityNotifications:
        actorProfile.onlyActionablePriorityNotifications,
    }
  }

  /**
   * Blocks or unblocks the given senders and sender categories for an actor
   * profile (delegation) in a single transaction. If a sender or category is
   * given more than once, the last entry wins. Sender blocks leave category
   * blocks untouched. The actor profile is created if something is blocked
   * and it does not exist yet; an existing one is never modified.
   */
  async updateActorSettings(
    toNationalId: string,
    fromNationalId: string,
    {
      categories = [],
      senders = [],
    }: {
      categories?: UpdateNotificationCategoryDto[]
      senders?: UpdateNotificationSenderDto[]
    },
  ): Promise<void> {
    await this.userProfileService.verifyIncomingDelegation(
      toNationalId,
      fromNationalId,
    )

    const { toBlock: categoriesToBlock, toUnblock: categoriesToUnblock } =
      this.splitCategoryUpdates(categories)
    const { toBlock: sendersToBlock, toUnblock: sendersToUnblock } =
      this.splitSenderUpdates(senders)

    const hasBlocks = categoriesToBlock.length > 0 || sendersToBlock.length > 0
    const hasUnblocks =
      categoriesToUnblock.length > 0 || sendersToUnblock.length > 0

    if (!hasBlocks && !hasUnblocks) {
      return
    }

    await this.sequelize.transaction(async (transaction) => {
      let actorProfileId: string | undefined

      if (hasBlocks) {
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
      } else {
        // Nothing to unblock if the actor profile doesn't exist
        actorProfileId = (
          await this.actorProfileModel.findOne({
            where: { toNationalId, fromNationalId },
            attributes: ['id'],
            transaction,
          })
        )?.id
      }

      if (!actorProfileId) {
        return
      }

      if (categoriesToBlock.length > 0) {
        await this.actorBlockedNotificationModel.bulkCreate(
          categoriesToBlock.map(({ senderId, category, categoryLabel }) => ({
            actorProfileId,
            senderId,
            category,
            categoryLabel,
          })),
          { ignoreDuplicates: true, transaction },
        )
      }

      if (categoriesToUnblock.length > 0) {
        await this.actorBlockedNotificationModel.destroy({
          where: {
            actorProfileId,
            [Op.or]: categoriesToUnblock.map(({ senderId, category }) => ({
              senderId,
              category,
            })),
          },
          transaction,
        })
      }

      if (sendersToBlock.length > 0) {
        await this.actorBlockedNotificationSenderModel.bulkCreate(
          sendersToBlock.map(({ senderId }) => ({ actorProfileId, senderId })),
          { ignoreDuplicates: true, transaction },
        )
      }

      if (sendersToUnblock.length > 0) {
        await this.actorBlockedNotificationSenderModel.destroy({
          where: {
            actorProfileId,
            senderId: sendersToUnblock.map(({ senderId }) => senderId),
          },
          transaction,
        })
      }
    })
  }

  /** Normalizes and dedupes (last wins), then splits into block/unblock */
  private splitCategoryUpdates(categories: UpdateNotificationCategoryDto[]) {
    const updates = this.dedupe(
      categories.map((category) => ({
        ...category,
        senderId: this.normalizeSenderId(category.senderId),
      })),
      ({ senderId, category }) => toCategoryKey(senderId, category),
    )

    // UpdateNotificationCategoryDto requires a categoryLabel when blocking
    const toBlock = updates.filter(
      (update): update is typeof update & { categoryLabel: CategoryLabelDto } =>
        update.blocked,
    )
    const toUnblock = updates.filter(({ blocked }) => !blocked)

    return { toBlock, toUnblock }
  }

  /** Normalizes and dedupes (last wins), then splits into block/unblock */
  private splitSenderUpdates(senders: UpdateNotificationSenderDto[]) {
    const updates = this.dedupe(
      senders.map((sender) => ({
        ...sender,
        senderId: this.normalizeSenderId(sender.senderId),
      })),
      ({ senderId }) => senderId,
    )

    return {
      toBlock: updates.filter(({ blocked }) => blocked),
      toUnblock: updates.filter(({ blocked }) => !blocked),
    }
  }

  private dedupe<T>(items: T[], toKey: (item: T) => string): T[] {
    const byKey = new Map<string, T>()
    for (const item of items) {
      byKey.set(toKey(item), item)
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
