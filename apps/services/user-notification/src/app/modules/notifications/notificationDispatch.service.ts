import { Injectable, Inject } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Notification } from './types'
import { FIREBASE_PROVIDER } from '../../../constants'
import { V2UsersApi } from '@island.is/clients/user-profile'

export class PushNotificationError extends Error {
  constructor(public readonly firebaseErrors: firebaseAdmin.FirebaseError[]) {
    super(firebaseErrors.map((e) => e.message).join('. '))
  }
}

const isTokenError = (e: firebaseAdmin.FirebaseError): boolean => {
  return (
    (e.code === 'messaging/invalid-argument' &&
      e.message.includes('not a valid FCM registration token')) ||
    e.code === 'messaging/registration-token-not-registered'
  )
}

@Injectable()
export class NotificationDispatchService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(FIREBASE_PROVIDER) private firebase: firebaseAdmin.app.App,
    private userProfileApi: V2UsersApi,
  ) {}

  async sendPushNotification({
    notification,
    nationalId,
    messageId,
  }: {
    notification: Notification
    nationalId: string
    messageId: string
  }): Promise<void> {
    const deviceTokensResponse = await this.userProfileApi.userTokenControllerFindUserDeviceToken({
      xParamNationalId: nationalId,
    })

    const tokens = deviceTokensResponse.map((token) => token.deviceToken)

    if (tokens.length === 0) {
      this.logger.info('No push-notification tokens found for user', { messageId })
      return
    } else {
      this.logger.info(`Found user push-notification tokens (${tokens.length})`, { messageId })
    }

    this.logger.info(`Notification content for message (${messageId})`, {
      messageId,
      ...notification,
    })

    const errors: firebaseAdmin.FirebaseError[] = []

    for (const token of tokens) {
      try {
        await this.firebase.messaging().send({
          token,
          notification: {
            title: notification.title,
            body: notification.body,
          },
          ...(notification.category && {
            apns: {
              payload: {
                aps: {
                  category: notification.category,
                },
              },
            },
          }),
          data: {
            createdAt: new Date().toISOString(),
            messageId,
            ...(notification.appURI && {
              url: notification.appURI,
              islandIsUrl: notification.appURI,
            }),
            ...(notification.dataCopy && { copy: notification.dataCopy }),
          },
        })
        this.logger.info('Push notification success', { firebaseMessageId: token, messageId })
      } catch (error) {
        if (isTokenError(error)) {
          this.logger.info('Invalid/outdated push notification token', { error, messageId })
          await this.userProfileApi.userTokenControllerDeleteUserDeviceToken({
            xParamNationalId: nationalId,
            deviceToken: token,
          })
        } else {
          this.logger.error('Push notification error', { error, messageId })
          errors.push(error)
        }
      }
    }

    if (errors.length > 0) {
      throw new PushNotificationError(errors)
    }
  }
}
