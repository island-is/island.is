import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import {
  BlockCategoryDto,
  UnblockCategoryDto,
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

  async blockCategories(
    nationalId: string,
    categories: BlockCategoryDto[],
  ): Promise<void> {
    const rows = this.dedupe(
      categories.map(({ senderId, category, categoryLabel }) => ({
        nationalId,
        senderId: this.normalizeSenderId(senderId),
        category,
        categoryLabel,
      })),
    )

    if (rows.length === 0) {
      return
    }

    // The user may not have a profile yet, e.g. if they have never onboarded.
    await this.userProfileService.findOrCreateUserProfile(nationalId)

    await this.blockedNotificationModel.bulkCreate(rows, {
      ignoreDuplicates: true,
    })
  }

  async unblockCategories(
    nationalId: string,
    categories: UnblockCategoryDto[],
  ): Promise<void> {
    const pairs = this.dedupe(
      categories.map(({ senderId, category }) => ({
        senderId: this.normalizeSenderId(senderId),
        category,
      })),
    )

    if (pairs.length === 0) {
      return
    }

    await this.blockedNotificationModel.destroy({
      where: { nationalId, [Op.or]: pairs },
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
