import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { BlockedNotification } from './models/blockedNotification.model'
import { UserProfileService } from './user-profile.service'
import { normalizeKennitala } from './utils/normalize-kennitala'

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
      attributes: ['senderId'],
      order: [
        ['created', 'ASC'],
        ['senderId', 'ASC'],
      ],
    })

    return {
      blockedSenders: blockedNotifications.map(({ senderId }) => ({
        senderId,
      })),
    }
  }

  async blockSender(nationalId: string, senderId: string): Promise<void> {
    const normalizedSenderId = this.normalizeSenderId(senderId)

    // The user may not have a profile yet, e.g. if they have never onboarded.
    await this.userProfileService.findOrCreateUserProfile(nationalId)

    await this.blockedNotificationModel.bulkCreate(
      [{ nationalId, senderId: normalizedSenderId }],
      { ignoreDuplicates: true },
    )
  }

  async unblockSender(nationalId: string, senderId: string): Promise<void> {
    const normalizedSenderId = this.normalizeSenderId(senderId)

    await this.blockedNotificationModel.destroy({
      where: { nationalId, senderId: normalizedSenderId },
    })
  }

  private normalizeSenderId(senderId: string): string {
    const normalizedSenderId = normalizeKennitala(senderId)

    if (!/^\d{10}$/.test(normalizedSenderId)) {
      throw new BadRequestException('Sender id is not valid')
    }

    return normalizedSenderId
  }
}
