import {
  CreateNotificationResponse,
  HnippNotificationOriginalRecipientDto,
  NotificationsApi,
} from '@island.is/clients/user-notification'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { NotificationArgs } from './notificationTypes'
import { NotificationConfig, NotificationType } from './notificationsTemplates'

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationApi: NotificationsApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {
    this.logger = logger.child({ context: 'NotificationsService' })
  }

  /**
   * Sends a notification using the specified type and arguments.
   *
   * @param data - The notification data object
   * @param data.type - The type of notification (User, Order, or System)
   * @param data.messageParties.recipient - The recipient nationalId of the notification
   * @param data.messageParties.sender - Optional. The sender nationalId of the notification
   * @param data.applicationId - Optional. The applicationId of the notification
   * @param data.args - The arguments specific to the notification type
 
   *
   * @example
   * // Sending a User notification
   * notificationsService.sendNotification({
   *   type: NotificationType.User,
   *   messageParties: {
   *     recipient: 'user@example.com',
   *   },
   *   applicationId: '12345',
   *   args: {
   *     username: 'johndoe',
   *     email: 'johndoe@example.com'
   *   }
   * });
   *
   * @example
   * // Sending an Order notification with a sender
   * notificationsService.sendNotification({
   *   type: NotificationType.Order,
   *   messageParties: {
   *     recipient: 'customer@example.com',
   *   },
   *   applicationId: '12345',
   *   args: {
   *     orderId: '12345',
   *     orderStatus: 'Shipped'
   *   },
   *   sender: 'orders@company.com'
   * });
   */
  public async sendNotification<T extends NotificationType>(data: {
    type: T
    messageParties: {
      recipient: string
      sender?: string
      onBehalfOf?: HnippNotificationOriginalRecipientDto
    }
    applicationId?: string
    args?: NotificationArgs<T>
  }): Promise<CreateNotificationResponse> {
    const templateId = NotificationConfig[data.type].templateId

    const notification = {
      recipient: data.messageParties.recipient,
      templateId,
      senderId: data.messageParties.sender,
      onBehalfOf: data.messageParties.onBehalfOf,
      args: Object.entries(data.args ?? {}).map(([key, value]) => ({
        key,
        value: String(value),
      })),
    }

    const response =
      await this.notificationApi.notificationsControllerCreateHnippNotification(
        {
          createHnippNotificationDto: notification,
        },
      )

    this.logger.info(
      `Notification with templateId ${templateId} and messageId ${response.id} sent for application ${data.applicationId}`,
    )

    return response
  }
}
