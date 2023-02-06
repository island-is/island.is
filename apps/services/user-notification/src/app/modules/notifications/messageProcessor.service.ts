import { Inject, Injectable } from '@nestjs/common'
import { Notification } from './types'
import { UserProfile } from '@island.is/clients/user-profile'
import { NotificationsService } from './notifications.service'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'

export const APP_PROTOCOL = Symbol('APP_PROTOCOL')
export interface MessageProcessorServiceConfig {
  appProtocol: string
}

@Injectable()
export class MessageProcessorService {
  constructor(
    // @Inject(APP_PROTOCOL)
    // private readonly appProtocol: string,
    private readonly notificationsService: NotificationsService,
  ) {}

  async convertToNotification(
    message: CreateHnippNotificationDto,
    profile: UserProfile,
  ): Promise<Notification> {
    const template = await this.notificationsService.getTemplate(
      message.templateId,
      profile.locale,
    )
    console.log('template******************+', template)
    const notification = await this.notificationsService.formatArguments(
      message,
      template,
    )

    return {
      title: notification.notificationTitle,
      body: notification.notificationBody,
      dataCopy: notification.notificationDataCopy,
      category: notification.category,
      appURI: notification.clickAction,
    }
  }
}
