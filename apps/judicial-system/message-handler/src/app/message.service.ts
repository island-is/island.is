import { Injectable } from '@nestjs/common'

import { logger } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'

import { MessageType } from '@island.is/judicial-system/message'
import type { Message } from '@island.is/judicial-system/message'

import { appModuleConfig } from './app.config'
import { RulingNotificationService } from './rulingNotification.service'
import { CaseDeliveryService } from './caseDelivery.service'
import { ProsecutorDocumentsDeliveryService } from './prosecutorDocumentsDelivery.service'

@Injectable()
export class MessageService {
  constructor(
    @InjectWorker(appModuleConfig().sqsQueueName) private worker: WorkerService,
    private readonly rulingNotificationService: RulingNotificationService,
    private readonly caseDeliveryService: CaseDeliveryService,
    private readonly prosecutorDocumentsDeliveryService: ProsecutorDocumentsDeliveryService,
  ) {}

  private async handleCaseCompletedMessage(caseId: string): Promise<void> {
    await this.rulingNotificationService.sendRulingNotification(caseId)
    await this.caseDeliveryService.deliverCase(caseId)
  }

  private async handleCaseConnectedToCourtCaseMessage(
    caseId: string,
  ): Promise<void> {
    await this.prosecutorDocumentsDeliveryService.deliverProsecutorDocuments(
      caseId,
    )
  }

  async run(): Promise<void> {
    logger.info('Initiating message handler')

    await this.worker.run(
      async (message: Message): Promise<void> => {
        logger.debug('Handling message', message)

        switch (message.type) {
          case MessageType.CASE_COMPLETED:
            return this.handleCaseCompletedMessage(message.caseId)
          case MessageType.CASE_CONNECTED_TO_COURT_CASE:
            return this.handleCaseConnectedToCourtCaseMessage(message.caseId)
          default:
            logger.error('Unknown message type', message)
        }
      },
    )
  }
}
