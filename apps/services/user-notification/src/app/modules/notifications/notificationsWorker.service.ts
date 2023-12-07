import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  UserProfileApi,
  // UserProfileLocaleEnum,
} from '@island.is/clients/user-profile'
import { NotificationDispatchService } from './notificationDispatch.service'
import { MessageProcessorService } from './messageProcessor.service'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { InjectModel } from '@nestjs/sequelize'
// import { NotificationStatus } from './dto/notification.dto'
import { Notification } from './notification.model'

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
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
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
        this.logger.info('Message received by worker 1.1', { messageId })

        // const exampleNotificationData = {
        //   recipient: '0101302989', // temp hardfix // user.nationalId,
        //   messageId,
        //   templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        //   args: [
        //     {
        //       key: 'organization',
        //       value: 'Hnipp Test Crew',
        //     },
        //     {
        //       key: 'documentId',
        //       value: 'abcd-abcd-abcd-abcd',
        //     },
        //   ],
        //   status: NotificationStatus.UNREAD,
        // }
        const notification = { messageId, ...message }
        const messageIdExists = await this.notificationModel.count({
          where: { messageId },
        })

        if (messageIdExists > 0) {
          // messageId exists do nothing
          this.logger.info('notification already exists 1.1', {
            messageId,
          })
        } else {
          // messageId does not exist
          // write to db
          try {
            const res = await this.notificationModel.create(notification as any)
            if (res) {
              this.logger.info('notification written to db 1.1', {
                notification,
                messageId,
              })
            }
          } catch (e) {
            this.logger.error('error writing notification to db 1.1', {
              e,
              messageId,
            })
          }
        }

        const profile =
          await this.userProfileApi.userTokenControllerFindOneByNationalId({
            nationalId: message.recipient,
          })

        // // temp Mocking user profile
        // const profile = <any>{
        //   nationalId: message.recipient,
        //   mobilePhoneNumber: '1234567',
        //   email: 'rafnarnason@gmail.com',
        //   name: 'Rafn Arnason',
        //   locale: UserProfileLocaleEnum.Is,
        //   notifications: {},
        //   created: new Date(),
        //   modified: new Date(),
        //   documentNotifications: true,
        //   emailNotifications: true,
        //   smsNotifications: true,
        //   pushNotifications: true,
        //   id: '1234567',
        //   emailVerified: true,
        //   mobilePhoneNumberVerified: true,
        //   profileImageUrl: '',
        //   emailStatus: 'yes',
        //   mobileStatus: 'yes',
        // }

        // can't send message if user has no user profile
        if (!profile) {
          this.logger.info('No user profile found for user', { messageId })
          return
        } else {
          this.logger.info('User found for message', { messageId })
        }

        // don't send message unless user wants this type of notification
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
