import { Inject, Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { Message, NewDocumentMessage } from './dto/createNotification.dto'
import { Notification, MessageTypes } from './types'
import messages from '../../../messages'
import { UserProfile } from '@island.is/clients/user-profile'

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
    return false
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
          category: MessageTypes.OneshotMessage,
          appURI: `${this.appProtocol}://inbox/${(message as NewDocumentMessage).documentId}`,
        }
      }
    }
    return {
      messageType: MessageTypes.Invalid,
      title: '',
      body: '',
      category: MessageTypes.Invalid,
    }
  }
}
