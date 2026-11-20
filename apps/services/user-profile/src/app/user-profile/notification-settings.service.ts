import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  CategoryLabelDto,
  UpdateNotificationCategoryDto,
} from './dto/blocked-category.dto'
import { UpdateNotificationSenderDto } from './dto/blocked-sender.dto'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { BlockedNotification } from './models/blockedNotification.model'
import { BlockedNotificationSender } from './models/blockedNotificationSender.model'
import { UserProfileService } from './user-profile.service'
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
    const categoryUpdates = this.dedupe(
      categories.map((category) => ({
        ...category,
        senderId: this.normalizeSenderId(category.senderId),
      })),
      ({ senderId, category }) => toCategoryKey(senderId, category),
    )
    const senderUpdates = this.dedupe(
      senders.map((sender) => ({
        ...sender,
        senderId: this.normalizeSenderId(sender.senderId),
      })),
      ({ senderId }) => senderId,
    )

    if (categoryUpdates.length === 0 && senderUpdates.length === 0) {
      return
    }

    // UpdateNotificationCategoryDto requires a categoryLabel when blocking
    const categoriesToBlock = categoryUpdates.filter(
      (update): update is typeof update & { categoryLabel: CategoryLabelDto } =>
        update.blocked,
    )
    const categoriesToUnblock = categoryUpdates.filter(
      ({ blocked }) => !blocked,
    )
    const sendersToBlock = senderUpdates.filter(({ blocked }) => blocked)
    const sendersToUnblock = senderUpdates.filter(({ blocked }) => !blocked)

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
