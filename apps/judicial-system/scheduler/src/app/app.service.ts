import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import { logger } from '@island.is/logging'

import { now } from './date.factory'
import { appModuleConfig } from './app.config'

function minutesBetween(startTime: Date, endTime: Date) {
  return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60))
}

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
  ) {}

  async run() {
    logger.info('Scheduler starting')

    const startTime = now()
    let done = false

    do {
      done = await fetch(
        `${this.config.backendUrl}/api/internal/cases/archive`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backendAuthToken}`,
          },
        },
      )
        .then(async (res) => {
          const response = await res.json()

          if (res.ok) {
            return !response.archived
          }

          logger.error('Failed to archive cases', { response })

          return true
        })
        .catch((reason) => {
          logger.error('Failed to archive cases', { reason })

          return true
        })
    } while (
      !done &&
      minutesBetween(startTime, now()) < this.config.timeToLiveMinutes
    )

    // Do someting

    logger.info('Scheduler done')
  }
}
