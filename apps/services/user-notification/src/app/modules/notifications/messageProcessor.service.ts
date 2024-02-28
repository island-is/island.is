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
      // We need to pass the template as a new object to avoid tempering with
      // the template object from the memory cache.
      // Shallow copy is enough with the current definition of HnippTemplate (./dto/hnippTemplate.response.ts)
      {
        ...template,
      },
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
