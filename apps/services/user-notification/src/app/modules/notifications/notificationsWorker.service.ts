import { Injectable, Inject } from '@nestjs/common'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { Message } from './dto/createNotification.dto'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { NotificationDispatchService } from './notificationDispatch.service'
import { MessageProcessorService } from './messageProcessor.service'
import { FetchError } from '@island.is/clients/middlewares'

const notFoundHandler = (e: unknown) => {
  if (e instanceof FetchError && e.status === 404) {
    return null
  }
  throw e
}

@Injectable()
export class NotificationsWorkerService {
  constructor(
    private notificationDispatch: NotificationDispatchService,
    private messageProcessor: MessageProcessorService,
    private userProfileApi: UserProfileApi,
    @InjectWorker('notifications')
    private worker: WorkerService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async run() {
    await this.worker.run(
      async (message: Message): Promise<void> => {
        this.logger.debug('Got message', message)

        const profile = await this.userProfileApi
          .userTokenControllerFindOneByNationalId({
            nationalId: message.recipient,
          })
          .catch(notFoundHandler)

        // can't send message if user has no user profile
        if (!profile) {
          this.logger.debug(
            `No user profile found for user ${message.recipient}`,
          )
          return
        }

        // don't send message unless user wants this type of notification
        if (
          !this.messageProcessor.shouldSendNotification(message.type, profile)
        ) {
          this.logger.debug(
            `User ${message.recipient} does not have notifications enabled for message type "${message.type}"`,
          )
          return
        }

        const notification = await this.messageProcessor.convertToNotification(
          message,
          profile,
        )

        await this.notificationDispatch.sendPushNotification(
          notification,
          profile.nationalId,
        )
      },
    )
  }
}
