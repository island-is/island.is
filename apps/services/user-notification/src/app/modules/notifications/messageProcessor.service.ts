import { Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { Message } from './dto/createNotification.dto'
import { User, Notification, MessageTypes } from './types'
import messages from '../../../messages'

const appProtocol = 'is.island.app'

@Injectable()
export class MessageProcessorService {
  constructor(private intlService: IntlService) {}

  shouldSendNotification(type: MessageTypes, user: User): boolean {
    switch (type) {
      case MessageTypes.NewDocumentMessage:
        return user.documentNotifications
    }
  }

  async convertToNotification(
    message: Message,
    user: User,
  ): Promise<Notification> {
    const t = await this.intlService.useIntl(
      ['user-notification.messages'],
      user.locale,
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
