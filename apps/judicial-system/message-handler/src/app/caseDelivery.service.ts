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
    logger.debug(`Delivering case ${caseId} to court and police`)

    return fetch(
      `${this.config.backendUrl}/api/internal/case/${caseId}/deliver`,
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
          logger.debug(`Delivered case ${caseId} to court`)

          if (!response.rulingDeliveredToCourt) {
            logger.error(
              `Failed to deliver the ruling for case ${caseId} to court`,
            )
          }

          if (!response.courtRecordDeliveredToCourt) {
            logger.error(
              `Failed to deliver the court record for case ${caseId} to court`,
            )
          }

          if (!response.caseFilesDeliveredToCourt) {
            logger.error(
              `Failed to deliver some case files for case ${caseId} to court`,
            )
          }

          if (!response.caseDeliveredToPolice) {
            logger.error(`Failed to deliver case ${caseId} to police`)
          }

          return
        }

        logger.error(`Failed to deliver case ${caseId} to court and police`, {
          response,
        })
      })
      .catch((reason) => {
        logger.error(`Failed to deliver case ${caseId} to court and police`, {
          reason,
        })
      })
  }
}
