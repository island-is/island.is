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

  async sendRulingNotification(caseId: string): Promise<void> {
    logger.debug(`Sending ruling notifications for case ${caseId}`)

    return fetch(
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
            `Ruling notifications${
              response.notificationSent ? '' : ' not'
            } sent for case ${caseId}`,
          )

          return
        }

        logger.error(`Failed to send ruling notifications for case ${caseId}`, {
          response,
        })
      })
      .catch((reason) => {
        logger.error(`Failed to send ruling notifications for case ${caseId}`, {
          reason,
        })
      })
  }
}
