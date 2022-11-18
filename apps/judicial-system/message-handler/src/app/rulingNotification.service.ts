import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NotificationType } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'

@Injectable()
export class RulingNotificationService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendRulingNotification(caseId: string): Promise<boolean> {
    this.logger.debug(`Sending ruling notification for case ${caseId}`)

    await fetch(
      `${this.config.backendUrl}/api/internal/case/${caseId}/notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.backendAccessToken}`,
        },
        body: JSON.stringify({ type: NotificationType.RULING }),
      },
    )
      .then(async (res) => {
        const response = await res.json()

        if (res.ok) {
          this.logger.debug(
            `Ruling notification${
              response.notificationSent ? '' : ' not'
            } sent for case ${caseId}`,
          )

          return
        }

        throw response
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to send ruling notification for case ${caseId}`,
          {
            reason,
          },
        )
      })

    return true
  }
}
