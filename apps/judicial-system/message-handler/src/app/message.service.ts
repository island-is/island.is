import { Injectable } from '@nestjs/common'

import { logger } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'

import { MessageType } from '@island.is/judicial-system/message'
import type {
  Message,
  CaseCompletedMessage,
} from '@island.is/judicial-system/message'

import { appModuleConfig } from './app.config'
import { CaseFilesUploadService } from './caseFilesUpload.service'

@Injectable()
export class MessageService {
  constructor(
    @InjectWorker(appModuleConfig().sqsQueueName) private worker: WorkerService,
    private readonly caseFilesUploadService: CaseFilesUploadService,
  ) {}

  private async handleCaseCompletedMessage(message: CaseCompletedMessage) {
    await this.caseFilesUploadService.uploadCaseFilesToCourt(message.caseId)
  }

  async run() {
    logger.info('Initiating message handler')

    await this.worker.run(async (message: Message) => {
      logger.debug('Handling message', message)

      switch (message.type) {
        case MessageType.CASE_COMPLETED:
          return this.handleCaseCompletedMessage(
            message as CaseCompletedMessage,
          )
        default:
          logger.error('Unknown message type', message)
      }
    })
  }
}
