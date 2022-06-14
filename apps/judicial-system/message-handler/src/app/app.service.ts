import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { logger } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'

import { MessageType } from '@island.is/judicial-system/message'
import type {
  Message,
  CaseCompletedMessage,
} from '@island.is/judicial-system/message'
import { CaseFileState } from '@island.is/judicial-system/types'
import type { CaseFile } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @InjectWorker(appModuleConfig().sqsQueueName) private worker: WorkerService,
  ) {}

  private async uploadCaseFilesToCourt(caseId: string, caseFiles: CaseFile[]) {
    logger.debug(`Uploading files of case ${caseId} to court`)

    for (const caseFile of caseFiles?.filter(
      (caseFile) => caseFile.state === CaseFileState.STORED_IN_RVG,
    ) ?? []) {
      await fetch(
        `${this.config.backendUrl}/api/internal/case/${caseId}/file/${caseFile.id}/court`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backendAccessToken}`,
          },
        },
      )
        .then(async (res) => {
          const response = await res.json()

          if (res.ok) {
            logger.debug(
              `Uploaded file ${caseFile.id} of case ${caseId} to court`,
            )
          } else {
            logger.error(
              `Failed to upload file ${caseFile.id} of case ${caseId} to court`,
              {
                response,
              },
            )
          }
        })
        .catch((reason) => {
          logger.error(
            `Failed to upload file ${caseFile.id} of case ${caseId} to court`,
            { reason },
          )
        })
      logger.debug('Done')
    }
  }

  private async handleCaseCompletedMessage(message: CaseCompletedMessage) {
    await fetch(
      `${this.config.backendUrl}/api/internal/case/${message.caseId}/files`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.backendAccessToken}`,
        },
      },
    )
      .then(async (res) => {
        const response = await res.json()

        if (res.ok) {
          return this.uploadCaseFilesToCourt(message.caseId, response)
        }

        logger.error(`Failed to get files of case ${message.caseId}`, {
          response,
        })
      })
      .catch((reason) => {
        logger.error(`Failed to get files of case ${message.caseId}`, {
          reason,
        })
      })
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
