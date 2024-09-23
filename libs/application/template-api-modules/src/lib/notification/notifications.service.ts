import { NotificationsApi } from '@island.is/clients/user-notification'
import { Injectable } from '@nestjs/common'
import {
  NotificationArgs,
  NotificationConfig,
  NotificationType,
} from './notificationTypes'

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationApi: NotificationsApi) {}

  /**
   * Sends a notification using the specified type and arguments.
   *
   * @param data - The notification data object
   * @param data.type - The type of notification (User, Order, or System)
   * @param data.recipient - The recipient nationalId of the notification
   * @param data.args - The arguments specific to the notification type
   * @param data.sender - Optional. The sender nationalId of the notification
   *
   * @example
   * // Sending a User notification
   * notificationsService.sendNotification({
   *   type: NotificationType.User,
   *   recipient: 'user@example.com',
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
   *   recipient: 'customer@example.com',
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

    console.log(notification)

    this.notificationApi.notificationsControllerCreateHnippNotification({
      createHnippNotificationDto: notification,
    })
  }
}
