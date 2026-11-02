import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  CategoryLabelDto,
  UpdateNotificationCategoryDto,
} from './dto/blocked-category.dto'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { BlockedNotification } from './models/blockedNotification.model'
import { UserProfileService } from './user-profile.service'
import { normalizeKennitala } from './utils/normalize-kennitala'

export const toCategoryKey = (senderId: string, category: string): string =>
  `${senderId}-${category}`

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectModel(BlockedNotification)
    private readonly blockedNotificationModel: typeof BlockedNotification,
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
    const updates = this.dedupe(
      categories.map((category) => ({
        ...category,
        senderId: this.normalizeSenderId(category.senderId),
      })),
    )

    if (updates.length === 0) {
      return
    }

    // UpdateNotificationCategoryDto requires a categoryLabel when blocking
    const toBlock = updates.filter(
      (update): update is typeof update & { categoryLabel: CategoryLabelDto } =>
        update.blocked,
    )
    const toUnblock = updates.filter(({ blocked }) => !blocked)

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
