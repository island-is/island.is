import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { logger } from '@island.is/logging'

import { appModuleConfig } from './app.config'

@Injectable()
export class CaseDeliveryService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
  ) {}

  async deliverCase(caseId: string): Promise<void> {
    logger.debug(`Uploading files of case ${caseId} to court`)

    return fetch(
      `${this.config.backendUrl}/api/internal/case/${caseId}/deliver`,
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
          logger.debug(`Delivered case ${caseId}`)

          if (response.caseFilesDeliveredToCourt) {
            logger.error(
              `Failed to deliver some case files for case ${caseId} to court`,
            )
          }

          return
        }

        logger.error(`Failed to deliver case ${caseId}`, {
          response,
        })
      })
      .catch((reason) => {
        logger.error(`Failed to deliver case ${caseId}`, {
          reason,
        })
      })
  }
}
