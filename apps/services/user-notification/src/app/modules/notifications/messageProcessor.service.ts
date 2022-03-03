import { Inject, Injectable } from '@nestjs/common'

import { UserProfile } from '@island.is/clients/user-profile'
import { IntlService } from '@island.is/cms-translations'

import messages from '../../../messages'

import { Message } from './dto/createNotification.dto'
import { MessageTypes,Notification } from './types'

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
  ) {}

  shouldSendNotification(type: MessageTypes, profile: UserProfile): boolean {
    switch (type) {
      case MessageTypes.NewDocumentMessage:
        return profile.documentNotifications
    }
  }

  async convertToNotification(
    message: Message,
    profile: UserProfile,
  ): Promise<Notification> {
    const t = await this.intlService.useIntl(
      ['user-notification.messages'],
      profile.locale ?? 'is',
    )

    const { title, body } = messages.notifications[message.type]

    switch (message.type) {
      case MessageTypes.NewDocumentMessage: {
        const formatArgs = {
          organization: message.organization,
        }
        return {
          messageType: message.type,
          title: t.formatMessage(title, formatArgs),
          body: t.formatMessage(body, formatArgs),
          category: 'NEW_DOCUMENT',
          appURI: `${this.appProtocol}://inbox/${message.documentId}`,
        }
      }
    }
  }
}
