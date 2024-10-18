import { Injectable } from '@nestjs/common'

import type { Locale } from '@island.is/shared/types'

import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { NotificationsService } from './notifications.service'
import { Notification } from './types'

@Injectable()
export class MessageProcessorService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async convertToNotification(
    message: CreateHnippNotificationDto,
    locale?: Locale,
  ): Promise<Notification> {
    const template = await this.notificationsService.getTemplate(
      message.templateId,
      locale,
    )
    const notification = await this.notificationsService.formatArguments(
      message.args,
      // We need to pass the template as a new object to avoid tempering with
      // the template object from the memory cache.
      // Shallow copy is enough with the current definition of HnippTemplate (./dto/hnippTemplate.response.ts)
      {
        ...template,
      },
      message.senderId,
      locale,
    )
    return {
      title: notification.title,
      externalBody: notification.externalBody,
      internalBody: notification.internalBody,
      clickActionUrl: notification.clickActionUrl,
    }
  }
}
