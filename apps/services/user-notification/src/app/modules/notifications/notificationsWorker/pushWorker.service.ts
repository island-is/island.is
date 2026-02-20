import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  InjectQueue,
  InjectWorker,
  QueueService,
  WorkerService,
} from '@island.is/message-queue'

import { NotificationDelivery } from '../notification-delivery.model'
import { NotificationDispatchService } from '../notificationDispatch.service'
import { Notification } from '../types'

export type PushQueueMessage = {
  messageId: string
  notificationId?: number
  nationalId: string
  notification: Notification
}

@Injectable()
export class PushWorkerService {
  constructor(
    private readonly notificationDispatch: NotificationDispatchService,

    @InjectWorker('notifications-push')
    private readonly worker: WorkerService,

    @InjectQueue('notifications-push')
    private readonly queue: QueueService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,

    @InjectModel(NotificationDelivery)
    private readonly notificationDeliveryModel: typeof NotificationDelivery,
  ) {}

  public async run() {
    await this.worker.run<PushQueueMessage>(
      async (message): Promise<void> => {
        const { messageId, notificationId, nationalId, notification } = message

        this.logger.info('Push worker received message', { messageId })

        await this.notificationDispatch.sendPushNotification({
          nationalId,
          notification,
          messageId,
          notificationId,
        })

        this.logger.info('Push notification sent', { messageId })

        try {
          await this.notificationDeliveryModel.create({
            messageId,
            channel: 'push',
          })
        } catch (error) {
          this.logger.error('Error writing push delivery record to db', {
            error,
            messageId,
          })
        }
      },
    )
  }
}
