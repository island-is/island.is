import { NotificationsApi } from '@island.is/clients/user-notification'
import { Injectable } from '@nestjs/common'
import { NotificationArgs } from './notificationTypes'
import { NotificationConfig, NotificationType } from './notificationsTemplates'

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationApi: NotificationsApi) {}

  /**
   * Sends a notification using the specified type and arguments.
   *
   * @param data - The notification data object
   * @param data.type - The type of notification (User, Order, or System)
   * @param data.messageParties.recipient - The recipient nationalId of the notification
   * @param data.messageParties.sender - Optional. The sender nationalId of the notification
   * @param data.args - The arguments specific to the notification type
 
   *
   * @example
   * // Sending a User notification
   * notificationsService.sendNotification({
   *   type: NotificationType.User,
   *   messageParties: {
   *     recipient: 'user@example.com',
   *   },
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
   *   args: {
   *     orderId: '12345',
   *     orderStatus: 'Shipped'
   *   },
   *   sender: 'orders@company.com'
   * });
   */
  public sendNotification<T extends NotificationType>(data: {
    type: T
    messageParties: {
      recipient: string
      sender?: string
    }
    args?: NotificationArgs<T>
  }) {
    const templateId = NotificationConfig[data.type].templateId

    const notification = {
      recipient: data.messageParties.recipient,
      templateId,
      senderId: data.messageParties.sender,
      args: Object.entries(data.args ?? {}).map(([key, value]) => ({
        key,
        value: String(value),
      })),
    }

    this.notificationApi.notificationsControllerCreateHnippNotification({
      createHnippNotificationDto: notification,
    })
  }
}
