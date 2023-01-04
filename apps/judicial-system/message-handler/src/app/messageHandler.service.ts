import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  MessageType,
  MessageService,
  CaseFileMessage,
  PoliceCaseMessage,
  DefendantMessage,
  UserMessage,
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
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleMessage(message: CaseMessage): Promise<boolean> {
    this.logger.debug('Handling message', { msg: message })

    let handled = false

    switch (message.type) {
      case MessageType.DELIVER_PROSECUTOR_TO_COURT: {
        const userMessage = message as UserMessage
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          `deliverProsecutorToCourt`,
          { userId: userMessage.userId },
        )
        break
      }
      case MessageType.DELIVER_DEFENDANT_TO_COURT: {
        const defendantMessage: DefendantMessage = message as DefendantMessage
        handled = await this.internalDeliveryService.deliver(
          defendantMessage.caseId,
          `defendant/${defendantMessage.defendantId}/deliverToCourt`,
          { userId: defendantMessage.userId },
        )
        break
      }
      case MessageType.DELIVER_CASE_FILE_TO_COURT: {
        const caseFileMessage = message as CaseFileMessage
        handled = await this.internalDeliveryService.deliver(
          caseFileMessage.caseId,
          `file/${caseFileMessage.caseFileId}/deliverToCourt`,
        )
        break
      }
      case MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT: {
        const policeCaseMessage = message as PoliceCaseMessage
        handled = await this.internalDeliveryService.deliver(
          policeCaseMessage.caseId,
          `deliverCaseFilesRecordToCourt/${policeCaseMessage.policeCaseNumber}`,
        )
        break
      }
      case MessageType.DELIVER_REQUEST_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          'deliverRequestToCourt',
        )
        break
      case MessageType.DELIVER_COURT_RECORD_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          'deliverCourtRecordToCourt',
        )
        break
      case MessageType.DELIVER_SIGNED_RULING_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          'deliverSignedRulingToCourt',
        )
        break
      case MessageType.DELIVER_CASE_TO_POLICE:
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          'deliverCaseToPolice',
        )
        break
      case MessageType.ARCHIVE_CASE_FILE: {
        const caseFileMessage = message as CaseFileMessage
        handled = await this.internalDeliveryService.deliver(
          caseFileMessage.caseId,
          `file/${caseFileMessage.caseFileId}/archive`,
        )
        break
      }
      case MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          'notification',
          { type: NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT },
        )
        break
      case MessageType.SEND_RULING_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          'notification',
          { type: NotificationType.RULING },
        )
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
            setTimeout(resolve, appModuleConfig().waitTimeSeconds * 1000),
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
