import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { appModuleConfig } from './app.config'

@Injectable()
export class ProsecutorDocumentsDeliveryService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async deliverProsecutorDocuments(caseId: string): Promise<boolean> {
    this.logger.debug(
      `Delivering prosecutor documents for case ${caseId} to court`,
    )

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
          this.logger.debug(
            `Delivered prosecutor documents for case ${caseId} to court`,
          )

          if (!response.requestDeliveredToCourt) {
            this.logger.error(
              `Failed to deliver the request for case ${caseId} to court`,
            )
          }

          return
        }

        throw response
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to deliver prosecutor documents for case ${caseId} to court`,
          {
            reason,
          },
        )
      })

    return true
  }
}
