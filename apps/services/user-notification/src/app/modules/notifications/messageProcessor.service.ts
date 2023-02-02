import { Inject, Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
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
    private intlService: IntlService,
    @Inject(APP_PROTOCOL)
    private readonly appProtocol: string,
    private readonly notificationsService: NotificationsService,
  ) {}

  async convertToNotification(
    message: CreateHnippNotificationDto,
    profile: UserProfile,
  ): Promise<Notification> {
    const template = await this.notificationsService.getTemplate(
      message.templateId,
      profile.locale ?? 'is-IS', // defaults or error to fix userprofile serivcd ?????
    )

    const notification = await this.notificationsService.formatArguments(
      message,
      template,
    )

    return {
      title: notification.notificationTitle,
      body: notification.notificationBody,
      category: notification.category,
      appURI: notification.clickAction,
    }
  }
}
