import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { SmsService } from '@island.is/nova-sms'

import {
  NotificationDelivery,
  NotificationChannel,
} from '../notification-delivery.model'

export type SmsQueueMessage = {
  messageId: string
  userNotificationId?: number
  actorNotificationId?: number
  mobilePhoneNumber: string
  smsContent: string
}

/**
 * Normalize a phone number to E.164 format by stripping hyphens/spaces.
 * e.g. "+354-1234567" → "+3541234567"
 */
const normalizePhoneNumber = (phoneNumber: string): string =>
  phoneNumber.replace(/[\s-]/g, '')

@Injectable()
export class SmsWorkerService {
  constructor(
    private readonly smsService: SmsService,

    @InjectWorker('notifications-sms')
    private readonly worker: WorkerService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,

    @InjectModel(NotificationDelivery)
    private readonly notificationDeliveryModel: typeof NotificationDelivery,
  ) {}

  public async run() {
    await this.worker.run<SmsQueueMessage>(async (message): Promise<void> => {
      const {
        messageId,
        userNotificationId,
        actorNotificationId,
        mobilePhoneNumber,
        smsContent,
      } = message

      this.logger.info('SMS worker received message', { messageId })

      const normalizedNumber = normalizePhoneNumber(mobilePhoneNumber)

      const result = await this.smsService.sendSms(normalizedNumber, smsContent)

      const msg = result.messages[0]
      if (!msg) {
        this.logger.error('SMS response contained no messages', { messageId })
        throw new Error(
          `SMS delivery failed for ${messageId}: no messages in response`,
        )
      }
      if (msg.error) {
        this.logger.error('SMS message-level error from Nova', {
          messageId,
          status: msg.status,
          errorDetails: msg.errorDetails,
        })
        throw new Error(
          `SMS delivery failed for ${messageId}: ${
            msg.errorDetails ?? msg.status
          }`,
        )
      }

      this.logger.info('SMS notification sent', {
        messageId,
        status: msg?.status,
      })

      if (userNotificationId) {
        try {
          await this.notificationDeliveryModel.create({
            userNotificationId,
            actorNotificationId,
            channel: NotificationChannel.Sms,
            sentTo: normalizedNumber,
          })
        } catch (error) {
          this.logger.error('Error writing SMS delivery record to db', {
            error,
            messageId,
          })
        }
      }
    })
  }
}
