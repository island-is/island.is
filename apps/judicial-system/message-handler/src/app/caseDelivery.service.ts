import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { appModuleConfig } from './app.config'

@Injectable()
export class CaseDeliveryService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async deliverCase(caseId: string): Promise<boolean> {
    this.logger.debug(`Delivering case ${caseId} to court and police`)

    await fetch(
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
          this.logger.debug(`Delivered case ${caseId} to court`)

          if (!response.caseFilesDeliveredToCourt) {
            this.logger.error(
              `Failed to deliver some case files for case ${caseId} to court`,
            )
          }

          if (!response.caseDeliveredToPolice) {
            this.logger.error(`Failed to deliver case ${caseId} to police`)
          }

          return
        }

        this.logger.error(
          `Failed to deliver case ${caseId} to court and police`,
          {
            response,
          },
        )
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to deliver case ${caseId} to court and police`,
          {
            reason,
          },
        )
      })

    return true
  }
}
