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

  // New arraignments can be added with only few hour notice
  // Maybe we should then also send an updated summary alert when arraignment is added today
  private async postDailyArraignmentsSummary() {
    // Fetch all court arrangement happening today
    const getCasesAtArraignmentDate = async () => {
      const today = new Date()

      try {
        const res = await fetch(
          `${this.config.backendUrl}/api/internal/cases/arraignmentDate/${today}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${this.config.backendAccessToken}`,
            },
          },
        )

        if (!res.ok) {
          throw new BadGatewayException(
            'Unexpected error occurred while fetching cases',
          )
        }
        return res.json()
        // send the aggregated notification for the cases: eventService -> new endpoint
      } catch (error) {
        throw new BadGatewayException(`Failed to fetch cases: ${error.message}`)
      }
    }

    const cases = await getCasesAtArraignmentDate()
    console.log({cases})
  }

  async run() {
    this.logger.info('Scheduler starting')

    await this.addMessagesForIndictmentsWaitingForConfirmationToQueue()
    await this.archiveCases()
    await this.postDailyArraignmentsSummary()

    this.logger.info('Scheduler done')
  }
}
