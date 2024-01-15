import { Injectable } from '@nestjs/common'
import { Notification } from './types'
import { UserProfileDto } from '@island.is/clients/user-profile'
import { NotificationsService } from './notifications.service'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'

export const APP_PROTOCOL = Symbol('APP_PROTOCOL')

export interface MessageProcessorServiceConfig {
  appProtocol: string
}

@Injectable()
export class MessageProcessorService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async convertToNotification(
    message: CreateHnippNotificationDto,
    profile: UserProfileDto,
  ): Promise<Notification> {
    const template = await this.notificationsService.getTemplate(
      message.templateId,
      profile.locale,
    )
    const notification = this.notificationsService.formatArguments(
      message.args,
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
