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
  notificationId?: number
  mobilePhoneNumber: string
  smsContent: string
}

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
      const { messageId, mobilePhoneNumber, smsContent } = message

      this.logger.info('SMS worker received message', { messageId })

      try {
        await this.smsService.sendSms(mobilePhoneNumber, smsContent)
      } catch (error) {
        this.logger.error('Error sending SMS', {
          error,
          messageId,
        })
      }

      this.logger.info('SMS notification sent', { messageId })

      try {
        await this.notificationDeliveryModel.create({
          messageId,
          channel: NotificationChannel.Sms,
        })
      } catch (error) {
        this.logger.error('Error writing SMS delivery record to db', {
          error,
          messageId,
        })
      }
    })
  }
}
