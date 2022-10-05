import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { logger } from '@island.is/logging'

import { appModuleConfig } from './app.config'

@Injectable()
export class ProsecutorDocumentsDeliveryService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
  ) {}

  async deliverProsecutorDocuments(caseId: string): Promise<boolean> {
    logger.debug(`Delivering prosecutor documents for case ${caseId} to court`)

    await fetch(
      `${this.config.backendUrl}/api/internal/case/${caseId}/deliverProsecutorDocuments`,
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
            `Delivered prosecutor documents for case ${caseId} to court`,
          )

          if (!response.requestDeliveredToCourt) {
            logger.error(
              `Failed to deliver the request for case ${caseId} to court`,
            )
          }

          return
        }

        throw response
      })
      .catch((reason) => {
        logger.error(
          `Failed to deliver prosecutor documents for case ${caseId} to court`,
          {
            reason,
          },
        )
      })

    return true
  }
}
