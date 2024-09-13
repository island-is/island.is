import { NotificationsApi } from '@island.is/clients/user-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationApi: NotificationsApi) {}

  public sendNotification() {
    this.notificationApi.notificationsControllerCreateHnippNotification({
      createHnippNotificationDto: {
        recipient: 'recipient',
        templateId: 'templateId',
        senderId: 'senderId',
        args: [
          {
            key: 'key',
            value: 'value',
          },
        ],
      },
    })
  }
}
