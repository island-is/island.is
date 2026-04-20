import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'

import { NotificationDispatchService } from '../notificationDispatch.service'
import { Notification } from '../types'

export type PushQueueMessage = {
  messageId: string
  userNotificationId?: number
  actorNotificationId?: number
  nationalId: string
  notification: Notification
}

@Injectable()
export class PushWorkerService {
  constructor(
    private readonly notificationDispatch: NotificationDispatchService,

    @InjectWorker('notifications-push')
    private readonly worker: WorkerService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async run() {
    await this.worker.run<PushQueueMessage>(async (message): Promise<void> => {
      const {
        messageId,
        userNotificationId,
        actorNotificationId,
        nationalId,
        notification,
      } = message

      this.logger.info('Push worker received message', { messageId })

      await this.notificationDispatch.sendPushNotification({
        nationalId,
        notification,
        messageId,
        userNotificationId,
        actorNotificationId,
      })

      this.logger.info('Push notification sent', { messageId })
    })
  }
}
