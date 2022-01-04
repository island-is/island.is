import { Injectable, Inject } from '@nestjs/common'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { Message } from './dto/createNotification.dto'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { UserProfile, UserProfileApi } from '@island.is/clients/user-profile'
import { NotificationDispatchService } from './notificationDispatch.service'
import { MessageProcessorService } from './messageProcessor.service'
import { FetchError } from '@island.is/clients/middlewares'

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

        const profile = await this.fetchProfile(message.recipient)

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

  private async fetchProfile(nationalId: string): Promise<UserProfile | null> {
    try {
      return await this.userProfileApi.userTokenControllerFindOneByNationalId({
        nationalId,
      })
    } catch (e) {
      if (e instanceof FetchError && e.status === 404) {
        return null
      }
      throw e
    }
  }
}
