import fetch from 'node-fetch'

import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { NotificationDispatchType } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'
import { now } from './date.factory'

const minutesBetween = (startTime: Date, endTime: Date) => {
  return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60))
}

@Injectable()
export class AppService {
  constructor(
    private readonly messageService: MessageService,
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private addMessagesForIndictmentsWaitingForConfirmationToQueue() {
    return this.messageService
      .sendMessagesToQueue([
        {
          type: MessageType.NOTIFICATION_DISPATCH,
          body: {
            type: NotificationDispatchType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
          },
        },
      ])
      .catch((reason) =>
        // Tolerate failure, but log
        this.logger.error('Failed to dispatch notifications', { reason }),
      )
  }

  private async archiveCases() {
    const startTime = now()

    let done = false

    do {
      done = await fetch(
        `${this.config.backendUrl}/api/internal/cases/archive`,
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
            return !response.caseArchived
          }

          this.logger.error('Failed to archive cases', { response })

          return true
        })
        .catch((reason) => {
          this.logger.error('Failed to archive cases', { reason })

          return true
        })
    } while (
      !done &&
      minutesBetween(startTime, now()) < this.config.timeToLiveMinutes
    )
  }

  private async postDailyHearingArrangementSummary() {
    const today = now()
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/internal/cases/postHearingArrangements`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backendAccessToken}`,
          },
          body: JSON.stringify({ date: today }),
        },
      )

      if (!res.ok) {
        throw new BadGatewayException(
          'Unexpected error occurred while fetching cases',
        )
      }
    } catch (error) {
      throw new BadGatewayException(`Failed to fetch cases: ${error.message}`)
    }
  }

  private async resetLawyerRegistry() {
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/lawyer-registry/reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.backendAccessToken}`,
          },
        },
      )

      if (!res.ok) {
        throw new BadGatewayException(
          'Unexpected error occurred while resetting lawyer registry',
        )
      }
    } catch (error) {
      throw new BadGatewayException(
        `Failed to reset lawyer registry: ${error.message}`,
      )
    }
  }

  async run() {
    this.logger.info('Scheduler starting')

    await this.addMessagesForIndictmentsWaitingForConfirmationToQueue()
    await this.archiveCases()
    await this.postDailyHearingArrangementSummary()
    await this.resetLawyerRegistry()

    this.logger.info('Scheduler done')
  }
}
