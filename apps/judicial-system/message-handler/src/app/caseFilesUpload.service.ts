import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { logger } from '@island.is/logging'

import { CaseFileState } from '@island.is/judicial-system/types'
import type { CaseFile } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'

@Injectable()
export class CaseFilesUploadService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
  ) {}

  private async uploadRemainingCaseFilesToCourt(
    caseId: string,
    caseFiles: CaseFile[],
  ) {
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

  async uploadCaseFilesToCourt(caseId: string) {
    logger.debug(`Uploading files of case ${caseId} to court`)

    return fetch(
      `${this.config.backendUrl}/api/internal/case/${caseId}/files`,
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
          return this.uploadRemainingCaseFilesToCourt(caseId, response)
        }

        logger.error(`Failed to get files of case ${caseId}`, {
          response,
        })
      })
      .catch((reason) => {
        logger.error(`Failed to get files of case ${caseId}`, {
          reason,
        })
      })
  }
}
