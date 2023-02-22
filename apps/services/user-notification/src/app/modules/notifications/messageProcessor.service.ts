import { Inject, Injectable } from '@nestjs/common'
import { Notification } from './types'
import { UserProfile } from '@island.is/clients/user-profile'
import { NotificationsService } from './notifications.service'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

export const APP_PROTOCOL = Symbol('APP_PROTOCOL')
export interface MessageProcessorServiceConfig {
  appProtocol: string
}

@Injectable()
export class MessageProcessorService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
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
    const notification = this.notificationsService.formatArguments(
      message,
      template,
    )

    this.logger.info(notification)

    const prefix = new Date().toISOString() + '🔥🔥🔥'

    return {
      title: prefix + notification.notificationTitle,
      body: prefix + notification.notificationBody,
      dataCopy: notification.notificationDataCopy,
      category: notification.category,
      appURI: notification.clickAction,
    }
  }
}
