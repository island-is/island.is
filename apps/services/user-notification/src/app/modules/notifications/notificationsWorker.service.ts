import { Injectable, Inject } from '@nestjs/common'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { Message } from './dto/createNotification.dto'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NotificationDispatchService } from './notificationDispatch.service'
import { MessageProcessorService } from './messageProcessor.service'
import { User } from './types'

@Injectable()
export class NotificationsWorkerService {
  constructor(
    private notificationDispatch: NotificationDispatchService,
    private messageProcessor: MessageProcessorService,
    @InjectWorker('notifications')
    private worker: WorkerService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async run() {
    await this.worker.run(
      async (message: Message): Promise<void> => {
        this.logger.debug('Got message', message)

        // TODO: call user-profile service to get user
        const user: User = {
          nationalId: message.recipient,
          locale: Math.random() < 0.5 ? 'is' : 'en',
          documentNotifications: true,
        }

        if (!this.messageProcessor.shouldSendNotification(message.type, user)) {
          this.logger.debug(
            `User ${user.nationalId} does not have notifications enabled for message type "${message.type}"`,
          )
          return
        }

        const notification = await this.messageProcessor.convertToNotification(
          message,
          user,
        )

        await this.notificationDispatch.sendPushNotification(
          notification,
          user.nationalId,
        )
      },
    )
  }
}
