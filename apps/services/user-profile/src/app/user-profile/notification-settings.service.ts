import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger } from 'winston'

import type { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { UserNotificationClient } from '../user-notification/user-notification.client'

import { NotificationSenderSettingDto } from './dto/notification-sender-setting.dto'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { NotificationSenderSetting } from './models/notificationSenderSetting.model'
import { UserProfile } from './models/userProfile.model'
import { normalizeKennitala } from './utils/normalize-kennitala'

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectModel(NotificationSenderSetting)
    private readonly notificationSenderSettingModel: typeof NotificationSenderSetting,
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    private readonly userNotificationClient: UserNotificationClient,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) { }

  /**
   * Returns the notification settings for the user. The first time this is called for a
   * user, the sender settings are seeded from the senders of the user's existing notifications.
   */
  async findSettings(user: User): Promise<NotificationSettingsDto> {
    return {
      senders: await this.findSenderSettings(user),
    }
  }

  async update(
    nationalId: string,
    senderId: string,
    { enabled }: { enabled: boolean },
  ): Promise<NotificationSenderSettingDto> {
    const normalizedSenderId = normalizeKennitala(senderId)

    const [count, rows] = await this.notificationSenderSettingModel.update(
      { enabled },
      {
        where: { nationalId, senderId: normalizedSenderId },
        returning: true,
      },
    )

    if (count === 0 || !rows[0]) {
      throw new NotFoundException(
        `Notification sender setting not found for sender ${normalizedSenderId}`,
      )
    }

    return this.toDto(rows[0])
  }

  async markAllAsSeen(nationalId: string): Promise<void> {
    await this.notificationSenderSettingModel.update(
      { seen: true },
      { where: { nationalId, seen: false } },
    )
  }

  /**
   * Ensures a sender setting exists for the user. Idempotent; existing settings are left untouched.
   */
  async ensureSender(nationalId: string, senderId: string): Promise<void> {
    const normalizedSenderId = normalizeKennitala(senderId)

    if (!normalizedSenderId) {
      throw new BadRequestException('Sender id is not valid')
    }

    const existing = await this.notificationSenderSettingModel.findOne({
      where: { nationalId, senderId: normalizedSenderId },
      attributes: ['id'],
    })

    if (existing) {
      return
    }

    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId },
      attributes: ['nationalId'],
    })

    if (!userProfile) {
      throw new NotFoundException('User profile not found')
    }

    await this.notificationSenderSettingModel.bulkCreate(
      [
        {
          nationalId,
          senderId: normalizedSenderId,
          enabled: true,
          seen: false,
        },
      ],
      { ignoreDuplicates: true },
    )
  }

  private async findSenderSettings(
    user: User,
  ): Promise<NotificationSenderSettingDto[]> {
    const { nationalId } = user
    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId },
    })

    if (!userProfile) {
      return []
    }

    if (!userProfile.notificationSendersInitializedAt) {
      await this.initializeSenders(user, userProfile)
    }

    const settings = await this.notificationSenderSettingModel.findAll({
      where: { nationalId },
      order: [
        ['created', 'ASC'],
        ['senderId', 'ASC'],
      ],
    })

    return settings.map(this.toDto)
  }

  private async initializeSenders(
    user: User,
    userProfile: UserProfile,
  ): Promise<void> {
    let senderIds: string[]

    try {
      const senders = await this.userNotificationClient.findSenders(user)
      senderIds = senders.map((sender) => sender.senderId)
    } catch (error) {
      // Leave the profile uninitialized so this is retried on the next request.
      this.logger.warn('Failed to fetch notification senders for user', {
        error,
      })
      return
    }

    const uniqueSenderIds = [
      ...new Set(senderIds.map(normalizeKennitala).filter(Boolean)),
    ]

    if (uniqueSenderIds.length > 0) {
      await this.notificationSenderSettingModel.bulkCreate(
        uniqueSenderIds.map((senderId) => ({
          nationalId: user.nationalId,
          senderId,
          enabled: true,
          seen: true,
        })),
        { ignoreDuplicates: true },
      )
    }

    await userProfile.update({ notificationSendersInitializedAt: new Date() })
  }

  private toDto(
    setting: NotificationSenderSetting,
  ): NotificationSenderSettingDto {
    return {
      senderId: setting.senderId,
      enabled: setting.enabled,
      seen: setting.seen,
    }
  }
}
