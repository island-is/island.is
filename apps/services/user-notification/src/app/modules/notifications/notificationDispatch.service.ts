import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as firebaseAdmin from 'firebase-admin'
import { DogStatsD } from '@island.is/infra-metrics'
import type { Logger } from '@island.is/logging'

import { METRICS_PREFIX } from './utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Notification } from './types'
import {
  NotificationDelivery,
  NotificationChannel,
} from './notification-delivery.model'
import { FIREBASE_PROVIDER } from '../../../constants'
import { V2UsersApi } from '@island.is/clients/user-profile'
import type { FirebaseError } from 'firebase-admin/lib/utils/error'

@Injectable()
export class NotificationDispatchService {
  private readonly metrics = new DogStatsD({ prefix: METRICS_PREFIX })

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(FIREBASE_PROVIDER) private firebase: firebaseAdmin.app.App,
    private userProfileApi: V2UsersApi,
    @InjectModel(NotificationDelivery)
    private readonly notificationDeliveryModel: typeof NotificationDelivery,
  ) {}

  async sendPushNotification({
    notification,
    nationalId,
    messageId,
    userNotificationId,
    actorNotificationId,
  }: {
    notification: Notification
    nationalId: string
    messageId: string
    userNotificationId?: number
    actorNotificationId?: number
  }): Promise<void> {
    const tokens = await this.getDeviceTokens(nationalId, messageId)

    if (tokens.length === 0) {
      return
    }

    this.logger.info(`Notification content for message (${messageId})`, {
      messageId,
      ...notification,
    })

    for (const token of tokens) {
      try {
        await this.sendNotificationToToken(
          notification,
          token,
          messageId,
          userNotificationId,
        )

        if (userNotificationId) {
          try {
            await this.notificationDeliveryModel.create({
              userNotificationId,
              actorNotificationId,
              channel: NotificationChannel.Push,
              sentTo: token,
            })
            this.metrics.increment('notification.delivery', 1, {
              channel: 'push',
              delivery_type: actorNotificationId ? 'delegation' : 'direct',
            })
          } catch (dbError) {
            this.logger.error('Error writing push delivery record to db', {
              error: dbError,
              messageId,
            })
          }
        }
      } catch (error) {
        await this.handleSendError(error, nationalId, token, messageId)
      }
    }
  }

  private async getDeviceTokens(
    nationalId: string,
    messageId: string,
  ): Promise<string[]> {
    try {
      const deviceTokensResponse =
        await this.userProfileApi.userTokenControllerFindUserDeviceToken({
          xParamNationalId: nationalId,
        })
      const tokens = deviceTokensResponse.map((token) => token.deviceToken)

      if (tokens.length === 0) {
        this.logger.info('No push-notification tokens found for user', {
          messageId,
        })
      } else {
        this.logger.info(
          `Found user push-notification tokens (${tokens.length})`,
          { messageId },
        )
      }

      return tokens
    } catch (error) {
      this.logger.error('Error fetching device tokens', { error, messageId })
      throw new InternalServerErrorException('Error fetching device tokens')
    }
  }

  private async sendNotificationToToken(
    notification: Notification,
    token: string,
    messageId: string,
    userNotificationId?: number,
  ): Promise<void> {
    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.externalBody,
      },
      data: {
        messageId,
        clickActionUrl: notification.clickActionUrl,
        ...(userNotificationId && {
          notificationId: String(userNotificationId),
        }),
      },
    }

    await this.firebase.messaging().send(message)
    this.logger.info('Push notification success', {
      messageId,
    })
  }

  private async handleSendError(
    error: FirebaseError,
    nationalId: string,
    token: string,
    messageId: string,
  ): Promise<void> {
    switch (error.code) {
      case 'messaging/invalid-argument':
      case 'messaging/registration-token-not-registered':
      case 'messaging/invalid-recipient':
      case 'messaging/mismatched-credential':
        this.logger.warn(
          'Firebase response.error calls for removing deviceToken',
          {
            error,
            messageId,
          },
        )
        await this.removeInvalidToken(nationalId, token, messageId)
        break
      case 'messaging/invalid-payload':
      case 'messaging/invalid-data-key':
      case 'messaging/invalid-options':
        this.logger.warn('Invalid message payload or options', {
          error,
          messageId,
        })
        break
      case 'messaging/quota-exceeded':
        this.logger.error('Quota exceeded for sending messages', {
          error,
          messageId,
        })
        break
      case 'messaging/server-unavailable':
      case 'messaging/unavailable':
        this.logger.warn('FCM server unavailable, retrying', {
          error,
          messageId,
        })
        break
      case 'messaging/message-rate-exceeded':
        throw new BadRequestException(error.code)
      case 'auth/invalid-credential':
        throw new InternalServerErrorException(error.code)
      case 'messaging/too-many-messages':
        this.logger.warn('Too many messages sent to the device', {
          error,
          messageId,
        })
        break
      case 'internal-error':
      case 'messaging/unknown-error':
      default:
        this.logger.error('Push notification error', { error, messageId })
        throw new InternalServerErrorException(error.code)
    }
  }

  private async removeInvalidToken(
    nationalId: string,
    token: string,
    messageId: string,
  ): Promise<void> {
    try {
      await this.userProfileApi.userTokenControllerDeleteUserDeviceToken({
        xParamNationalId: nationalId,
        deviceToken: token,
      })
      this.logger.info('Removed invalid device token', { token, messageId })
    } catch (error) {
      this.logger.error('Error removing device token for user', {
        error,
        messageId,
      })
    }
  }
}
