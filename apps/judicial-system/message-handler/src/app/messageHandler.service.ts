import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  MessageType,
  MessageService,
  CaseFileMessage,
} from '@island.is/judicial-system/message'
import type { Message } from '@island.is/judicial-system/message'

import { CaseDeliveryService } from './caseDelivery.service'
import { ProsecutorDocumentsDeliveryService } from './prosecutorDocumentsDelivery.service'
import { InternalDeliveryService } from './internalDelivery.service'
import { RulingNotificationService } from './rulingNotification.service'
import { appModuleConfig } from './app.config'

@Injectable()
export class MessageHandlerService implements OnModuleDestroy {
  private running!: boolean
  private runner!: Promise<void>

  constructor(
    private readonly messageService: MessageService,
    private readonly caseDeliveryService: CaseDeliveryService,
    private readonly prosecutorDocumentsDeliveryService: ProsecutorDocumentsDeliveryService,
    private readonly internalDeliveryService: InternalDeliveryService,
    private readonly rulingNotificationService: RulingNotificationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleMessage(message: Message): Promise<boolean> {
    this.logger.debug('Handling message', { msg: message })

    let handled = false

    switch (message.type) {
      case MessageType.CASE_CONNECTED_TO_COURT_CASE:
        handled = await this.prosecutorDocumentsDeliveryService.deliverProsecutorDocuments(
          message.caseId,
        )
        break
      case MessageType.CASE_COMPLETED:
        handled = await this.caseDeliveryService.deliverCase(message.caseId)
        break
      case MessageType.DELIVER_CASE_FILE_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.caseId,
          `file/${(message as CaseFileMessage).caseFileId}/deliverToCourt`,
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
      case MessageType.SEND_RULING_NOTIFICATION:
        handled = await this.rulingNotificationService.sendRulingNotification(
          message.caseId,
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
        .receiveMessagesFromQueue(async (message: Message) => {
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
