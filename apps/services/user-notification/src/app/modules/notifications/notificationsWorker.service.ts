import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { NotificationDispatchService } from './notificationDispatch.service'
import { MessageProcessorService } from './messageProcessor.service'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'

export const IS_RUNNING_AS_WORKER = Symbol('IS_NOTIFICATION_WORKER')

@Injectable()
export class NotificationsWorkerService implements OnApplicationBootstrap {
  constructor(
    private notificationDispatch: NotificationDispatchService,
    private messageProcessor: MessageProcessorService,
    private userProfileApi: UserProfileApi,
    @InjectWorker('notifications')
    private worker: WorkerService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(IS_RUNNING_AS_WORKER)
    private isRunningAsWorker: boolean,
  ) {}

  onApplicationBootstrap() {
    if (this.isRunningAsWorker) {
      this.run()
    }
  }

  async run() {
    await this.worker.run<CreateHnippNotificationDto>(
      async (message, job): Promise<void> => {
        const messageId = job.id
        this.logger.info('Message received by worker ... ...', { messageId })

        const profile =
          await this.userProfileApi.userTokenControllerFindOneByNationalId({
            nationalId: message.recipient,
          })

        // can't send message if user has no user profile
        if (!profile) {
          this.logger.info('No user profile found for user', { messageId })
          return
        } else {
          this.logger.info('User found for message', { messageId })
        }

        // don't send message unless user wants this type of notification
        // TODO change to pushNotifications
        if (!profile.documentNotifications) {
          this.logger.info(
            'User does not have notifications enabled this message type',
            { messageId },
          )
          return
        } else {
          this.logger.info('User has notifications enabled this message type', {
            messageId,
          })
        }

        if (profile.documentNotifications) {
          const notification =
            await this.messageProcessor.convertToNotification(message, profile)

          await this.notificationDispatch.sendPushNotification({
            nationalId: profile.nationalId,
            notification,
            messageId,
          })
        } else {
          this.logger.info(
            'User does not have notifications enabled this message type',
            { messageId },
          )
          return
        }
      },
    )
  }
}
