import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { NotificationsService } from '../../../../notification/notifications.service'
import { CreateNotificationResponse } from '@island.is/clients/user-notification'
import { NotificationArgs } from '../../../../notification/notificationTypes'
import { NotificationType } from '../../../../notification/notificationsTemplates'

@Injectable()
export class UserNotificationService extends BaseTemplateApiService {
  constructor(private readonly notificationsService: NotificationsService) {
    super('UserNotification')
  }

  public async sendNotification<T extends NotificationType>(data: {
    type: T
    messageParties: {
      recipient: string
      sender?: string
    }
    applicationId?: string
    args?: NotificationArgs<T>
  }): Promise<CreateNotificationResponse> {
    console.log('--------------------------------')
    console.log('sendNotification')
    console.dir(data, { depth: null, colors: true })
    console.log('--------------------------------')
    return this.notificationsService.sendNotification(data)
  }
}
