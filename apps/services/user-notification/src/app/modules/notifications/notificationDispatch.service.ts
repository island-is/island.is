import { Injectable, Inject } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Notification } from './types'
import { isDefined } from './utils'
import { FIREBASE_PROVIDER } from '../../../constants'
import { UserProfileApi } from '@island.is/clients/user-profile'

export class PushNotificationError extends Error {
  constructor(public readonly firebaseErrors: firebaseAdmin.FirebaseError[]) {
    super(firebaseErrors.map((e) => e.message).join('. '))
  }
}

// invalid/outdated token errors are expected
// https://firebase.google.com/docs/cloud-messaging/manage-tokens#detect-invalid-token-responses-from-the-fcm-backend
const isTokenError = (e: firebaseAdmin.FirebaseError): boolean => {
  // NB: if there is an issue with the push token we want to ignore the error.
  // If there is an error with any other request parameters we want to scream
  // error so we can fix it.
  // Firebase responds with invalid-argument for both invalid push tokens
  // and any other issues with the request parameters. The error code docs
  // (https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode) says
  // that the server responds with which field is invalid, but the FirebaseError
  // contains no such information, which means we have no way to tell the
  // difference other than inspecting the error message, which is really not
  // ideal since technically it might change at any time without notice.
  return (
    (e.code === 'messaging/invalid-argument' &&
      Boolean(e.message.match(/invalid.+token/gi))) ||
    e.code === 'messaging/unregistered'
  )
}

@Injectable()
export class NotificationDispatchService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(FIREBASE_PROVIDER) private firebase: firebaseAdmin.app.App,
    private userProfileApi: UserProfileApi,
  ) {}

  async sendPushNotification(
    notification: Notification,
    nationalId: string,
  ): Promise<void> {
    const deviceTokensResponse = await this.userProfileApi.userTokenControllerGetDeviceTokens(
      { nationalId },
    )

    const tokens = deviceTokensResponse.map((token) => token.deviceToken)

    if (tokens.length === 0) {
      this.logger.debug(`No push-notification tokens found for ${nationalId}`)
      return
    }

    const {
      responses,
      successCount,
    } = await this.firebase.messaging().sendMulticast({
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      apns: {
        payload: {
          aps: {
            category: notification.category,
          },
        },
      },
      data: {
        ...(notification.appURI && { url: notification.appURI }),
      },
    })

    const errors = responses
      .map((r) => r.error)
      .filter(isDefined)
      .filter((e) => !isTokenError(e))

    // throw if unsuccessful and there are unexpected errors
    if (successCount === 0 && errors.length > 0) {
      throw new PushNotificationError(errors)
    }

    // log otherwise
    for (const r of responses) {
      if (r.error && isTokenError(r.error)) {
        this.logger.debug('Invalid/outdated push notification token', r.error)
      } else if (r.error) {
        this.logger.error('Push notification error', r.error)
      } else {
        this.logger.debug(`Push notification success: ${r.messageId}`)
      }
    }
  }
}
