import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { logger } from '@island.is/logging'
import { NotificationType } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'

@Injectable()
export class RulingNotificationService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
  ) {}

  async sendRulingNotification(caseId: string): Promise<boolean> {
    logger.debug(`Sending ruling notification for case ${caseId}`)

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
          logger.debug(
            `Ruling notification${
              response.notificationSent ? '' : ' not'
            } sent for case ${caseId}`,
          )

          return
        }

        throw response
      })
      .catch((reason) => {
        logger.error(`Failed to send ruling notification for case ${caseId}`, {
          reason,
        })
      })

    return true
  }
}
