import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import type { User } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'

@Injectable()
export class InternalDeliveryService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async deliver(
    user: User,
    caseId: string,
    what: string,
    body: { [key: string]: unknown } = {},
  ): Promise<boolean> {
    this.logger.debug(`Posting ${what} for case ${caseId}`)

    return fetch(
      `${this.config.backendUrl}/api/internal/case/${caseId}/${what}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.backendAccessToken}`,
        },
        body: JSON.stringify({ ...body, user }),
      },
    )
      .then(async (res) => {
        const response = await res.json()

        if (!res.ok || !response.delivered) {
          throw response
        }

        this.logger.debug(`Posted ${what} for case ${caseId}`)

        return true
      })
      .catch((reason) => {
        this.logger.info(
          `Failed to post ${what} for case ${caseId} - attempting retry`,
          {
            reason,
          },
        )

        return false
      })
  }
}
