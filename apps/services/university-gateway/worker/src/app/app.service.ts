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
    logger.info('Worker starting')

    const startTime = now()
    let done = false

    do {
      // Update programs
      done = await fetch(
        `${this.config.backendUrl}/v1/internal/programs/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backendAccessToken}`,
          },
        },
      )
        .then(async (res) => {
          if (res.ok) {
            return true
          }

          logger.error('Failed to update programs')
          return true
        })
        .catch((reason) => {
          logger.error('Failed to update programs, reason:', { reason })
          return true
        })

      // Update courses
      fetch(`${this.config.backendUrl}/v1/internal/courses/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.config.backendAccessToken}`,
        },
      })
        .then(async (res) => {
          if (res.ok) {
            return true
          }

          logger.error('Failed to update courses')
          return true
        })
        .catch((reason) => {
          logger.error('Failed to update courses, reason:', { reason })
          return true
        })
    } while (
      !done &&
      minutesBetween(startTime, now()) < this.config.timeToLiveMinutes
    )

    logger.info('Worker done')
  }
}
