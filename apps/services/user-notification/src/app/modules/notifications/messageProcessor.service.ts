import { Inject, Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { CreateNotificationDto } from './dto/createNotification.dto'
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
    // documentNotifications is now the global switch for all notifications
    return profile.documentNotifications
  }

  
  async convertToNotification(
    message: CreateNotificationDto,
    profile: UserProfile,
  ): Promise<Notification> {

    // get template on selected language - map user profile locale to other
    // formatArsg
    // formatObject
    // return object



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
      case MessageTypes.TestMessage: {
        return {
          messageType: message.type,
          title: 'fixed test title', // t.formatMessage(title),
          body: 'fixed test body', //t.formatMessage(body),
          // category: 'NEW_DOCUMENT',
          // appURI: `${this.appProtocol}://inbox/${message.documentId}`,
        }
      }
    }
  }

  
}
