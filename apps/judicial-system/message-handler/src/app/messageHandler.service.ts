import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { MessageType, MessageService } from '@island.is/judicial-system/message'
import type { Message } from '@island.is/judicial-system/message'

import { RulingNotificationService } from './rulingNotification.service'
import { CaseDeliveryService } from './caseDelivery.service'
import { ProsecutorDocumentsDeliveryService } from './prosecutorDocumentsDelivery.service'

@Injectable()
export class MessageHandlerService implements OnModuleDestroy {
  private running!: boolean
  private runner!: Promise<void>

  constructor(
    private readonly messageService: MessageService,
    private readonly rulingNotificationService: RulingNotificationService,
    private readonly caseDeliveryService: CaseDeliveryService,
    private readonly prosecutorDocumentsDeliveryService: ProsecutorDocumentsDeliveryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async handleCaseCompletedMessage(caseId: string): Promise<boolean> {
    return (
      (await this.rulingNotificationService.sendRulingNotification(caseId)) &&
      (await this.caseDeliveryService.deliverCase(caseId))
    )
  }

  private async handleCaseConnectedToCourtCaseMessage(
    caseId: string,
  ): Promise<boolean> {
    return this.prosecutorDocumentsDeliveryService.deliverProsecutorDocuments(
      caseId,
    )
  }

  private async handleMessage(message: Message): Promise<boolean> {
    this.logger.debug('Handling message', { msg: message })

    let handled = false

    switch (message.type) {
      case MessageType.CASE_COMPLETED:
        handled = await this.handleCaseCompletedMessage(message.caseId)
        break
      case MessageType.CASE_CONNECTED_TO_COURT_CASE:
        handled = await this.handleCaseConnectedToCourtCaseMessage(
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
        .receiveMessageFromQueue(async (message: Message) => {
          return await this.handleMessage(message)
        })
        .catch((error) => {
          this.logger.error('Error handling message', { error })
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
