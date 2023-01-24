import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  MessageType,
  MessageService,
  CaseFileMessage,
  PoliceCaseMessage,
  DefendantMessage,
  NotificationMessage,
} from '@island.is/judicial-system/message'
import type { CaseMessage } from '@island.is/judicial-system/message'
import { NotificationType } from '@island.is/judicial-system/types'

import { InternalDeliveryService } from './internalDelivery.service'
import { appModuleConfig } from './app.config'

@Injectable()
export class MessageHandlerService implements OnModuleDestroy {
  private running!: boolean
  private runner!: Promise<void>

  constructor(
    private readonly messageService: MessageService,
    private readonly internalDeliveryService: InternalDeliveryService,
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleMessage(message: CaseMessage): Promise<boolean> {
    this.logger.debug('Handling message', { msg: message })

    let handled = false

    switch (message.type) {
      case MessageType.DELIVER_PROSECUTOR_TO_COURT: {
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          `deliverProsecutorToCourt`,
        )
        break
      }
      case MessageType.DELIVER_DEFENDANT_TO_COURT: {
        const defendantMessage: DefendantMessage = message as DefendantMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          defendantMessage.caseId,
          `defendant/${defendantMessage.defendantId}/deliverToCourt`,
        )
        break
      }
      case MessageType.DELIVER_CASE_FILE_TO_COURT: {
        const caseFileMessage = message as CaseFileMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          caseFileMessage.caseId,
          `file/${caseFileMessage.caseFileId}/deliverToCourt`,
        )
        break
      }
      case MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT: {
        const policeCaseMessage = message as PoliceCaseMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          policeCaseMessage.caseId,
          `deliverCaseFilesRecordToCourt/${policeCaseMessage.policeCaseNumber}`,
        )
        break
      }
      case MessageType.DELIVER_REQUEST_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'deliverRequestToCourt',
        )
        break
      case MessageType.DELIVER_COURT_RECORD_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'deliverCourtRecordToCourt',
        )
        break
      case MessageType.DELIVER_SIGNED_RULING_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'deliverSignedRulingToCourt',
        )
        break
      case MessageType.DELIVER_CASE_TO_POLICE:
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'deliverCaseToPolice',
        )
        break
      case MessageType.ARCHIVE_CASE_FILE: {
        const caseFileMessage = message as CaseFileMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          caseFileMessage.caseId,
          `file/${caseFileMessage.caseFileId}/archive`,
        )
        break
      }
      case MessageType.SEND_HEADS_UP_NOTIFICATION: {
        const notificationMessage = message as NotificationMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'notification',
          {
            type: NotificationType.HEADS_UP,
            eventOnly: notificationMessage.eventOnly,
          },
        )
        break
      }
      case MessageType.SEND_READY_FOR_COURT_NOTIFICATION: {
        const notificationMessage = message as NotificationMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'notification',
          {
            type: NotificationType.READY_FOR_COURT,
            eventOnly: notificationMessage.eventOnly,
          },
        )
        break
      }
      case MessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION: {
        const notificationMessage = message as NotificationMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'notification',
          {
            type: NotificationType.RECEIVED_BY_COURT,
            eventOnly: notificationMessage.eventOnly,
          },
        )
        break
      }
      case MessageType.SEND_COURT_DATE_NOTIFICATION: {
        const notificationMessage = message as NotificationMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'notification',
          {
            type: NotificationType.COURT_DATE,
            eventOnly: notificationMessage.eventOnly,
          },
        )
        break
      }
      case MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION: {
        const notificationMessage = message as NotificationMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'notification',
          {
            type: NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
            eventOnly: notificationMessage.eventOnly,
          },
        )
        break
      }
      case MessageType.SEND_RULING_NOTIFICATION: {
        const notificationMessage = message as NotificationMessage
        handled = await this.internalDeliveryService.deliver(
          message.userId,
          message.caseId,
          'notification',
          {
            type: NotificationType.RULING,
            eventOnly: notificationMessage.eventOnly,
          },
        )
        break
      }
      case MessageType.SEND_REVOKED_NOTIFICATION:
        {
          const notificationMessage = message as NotificationMessage
          handled = await this.internalDeliveryService.deliver(
            message.userId,
            message.caseId,
            'notification',
            {
              type: NotificationType.REVOKED,
              eventOnly: notificationMessage.eventOnly,
            },
          )
        }
        break
      default:
        this.logger.error('Unknown message type', { msg: message })
    }

    this.logger.debug(`Message ${handled ? 'handled' : 'not handled'}`, {
      msg: message,
    })

    return handled
  }

  private async receiveMessages(resolve: () => void): Promise<void> {
    this.logger.info('Message handler started')

    this.running = true

    while (this.running) {
      this.logger.debug('Checking for messages')

      await this.messageService
        .receiveMessagesFromQueue(async (message: CaseMessage) => {
          return await this.handleMessage(message)
        })
        .catch(async (error) => {
          this.logger.error('Error handling message', { error })

          // Wait a bit before trying again
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.waitTimeSeconds * 1000),
          )
        })
    }

    this.logger.info('Message handler stopped')

    resolve()
  }

  async run(): Promise<void> {
    this.runner = new Promise<void>((resolve) => {
      this.receiveMessages(resolve)
    })
  }

  async onModuleDestroy() {
    this.running = false

    if (this.runner) {
      await this.runner
    }
  }
}
