import { Injectable } from '@nestjs/common'

import { logger } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'

import { MessageType } from '@island.is/judicial-system/message'
import type { Message } from '@island.is/judicial-system/message'

import { appModuleConfig } from './app.config'
import { RulingNotificationService } from './rulingNotification.service'
import { CaseFilesUploadService } from './caseFilesUpload.service'

@Injectable()
export class MessageService {
  constructor(
    @InjectWorker(appModuleConfig().sqsQueueName) private worker: WorkerService,
    private readonly rulingNotificationService: RulingNotificationService,
    private readonly caseFilesUploadService: CaseFilesUploadService,
  ) {}

  private handleCaseCompletedMessage(caseId: string): Promise<void> {
    return this.caseFilesUploadService.uploadCaseFilesToCourt(caseId)
  }

  private handleRulingSignedMessage(caseId: string): Promise<void> {
    return this.rulingNotificationService.sendRulingNotification(caseId)
  }

  async run(): Promise<void> {
    logger.info('Initiating message handler')

    await this.worker.run(
      async (message: Message): Promise<void> => {
        logger.debug('Handling message', message)

        switch (message.type) {
          case MessageType.CASE_COMPLETED:
            return this.handleCaseCompletedMessage(message.caseId)
          case MessageType.RULING_SIGNED:
            return this.handleRulingSignedMessage(message.caseId)
          default:
            logger.error('Unknown message type', message)
        }
      },
    )
  }
}
