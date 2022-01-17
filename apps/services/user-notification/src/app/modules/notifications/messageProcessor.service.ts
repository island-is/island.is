import { Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { Message } from './dto/createNotification.dto'
import { Notification, MessageTypes } from './types'
import messages from '../../../messages'
import { UserProfile } from '@island.is/clients/user-profile'

const appProtocol = 'is.island.app'

@Injectable()
export class MessageProcessorService {
  constructor(private intlService: IntlService) {}

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
      profile.locale,
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
          appURI: `${appProtocol}://document/${message.documentId}`,
        }
      }
    }
  }
}
