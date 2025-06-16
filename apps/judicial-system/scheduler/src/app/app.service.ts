import addHours from 'date-fns/addHours'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isEqual from 'date-fns/isEqual'
import isWeekend from 'date-fns/isWeekend'
import fetch from 'node-fetch'

import { BadGatewayException, Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { NotificationDispatchType } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'
import { now } from './date.factory'

enum JobScheduleType {
  EveryDayAt2 = 'everyDayAt2',
  WeekdaysAt9 = 'weekdaysAt9',
}

enum JobType {
  ArchiveCase = 'archiveCases',
  PostDailyHearingInSlack = 'postDailyHearingInSlack',
  SendWaitingForConfirmation = 'sendWaitingForConfirmation',
}

type JobConfig = {
  type: JobType
  jobScheduleType: JobScheduleType
}

// create the job config
const JOBS: JobConfig[] = [
  {
    type: JobType.ArchiveCase,
    jobScheduleType: JobScheduleType.EveryDayAt2,
  },
  {
    type: JobType.PostDailyHearingInSlack,
    jobScheduleType: JobScheduleType.EveryDayAt2,
  },
  {
    type: JobType.SendWaitingForConfirmation,
    jobScheduleType: JobScheduleType.WeekdaysAt9,
  },
]

// pass down today as a date prop to limit calls to now() to simplify mocked calls in tests
const getTodayAtTime = (today: Date, hour: number) => {
  const todayAtHour = new Date(today)
  return new Date(todayAtHour.setHours(hour, 0, 0, 0))
}

const isBeforeOrEqual = (date: Date | number, dateToCompare: Date | number) =>
  isBefore(date, dateToCompare) || isEqual(date, dateToCompare)

const getCurrentJobScheduleType = () => {
  // Create 1H interval to check the target job time.
  // Example: Jobs are currently triggered at 2AM and 9AM.
  // Thus, if now = 9:01 our interval would be [8:01, 9:01] and we check if the
  // 9 AM timestamp falls in that interval
  const timeNow = now()
  const before = addHours(timeNow, -1)

  const today2AM = getTodayAtTime(timeNow, 2)
  const today9AM = getTodayAtTime(timeNow, 9)

  if (isBeforeOrEqual(today2AM, timeNow) && isAfter(today2AM, before)) {
    return JobScheduleType.EveryDayAt2
  }
  if (
    !isWeekend(today9AM) &&
    isBeforeOrEqual(today9AM, timeNow) &&
    isAfter(today9AM, before)
  ) {
    return JobScheduleType.WeekdaysAt9
  }

  return null
}

const minutesBetween = (startTime: Date, endTime: Date) =>
  Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60))

@Injectable()
export class AppService {
  constructor(
    private readonly messageService: MessageService,
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async addMessagesForIndictmentsWaitingForConfirmationToQueue() {
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

  private async runTargetJob(type: JobType) {
    switch (type) {
      case JobType.ArchiveCase:
        await this.archiveCases()
        break
      case JobType.PostDailyHearingInSlack:
        await this.postDailyHearingArrangementSummary()
        break
      case JobType.SendWaitingForConfirmation:
        await this.addMessagesForIndictmentsWaitingForConfirmationToQueue()
        break
    }
  }

  async run() {
    this.logger.info('Scheduler starting')

    const currentJobScheduleType = getCurrentJobScheduleType()
    if (!currentJobScheduleType) {
      this.logger.info('Scheduler done: No jobs executed')
      return
    }

    const filteredJobs = JOBS.filter(
      (job) => job.jobScheduleType === currentJobScheduleType,
    )
    for (const job of filteredJobs) {
      await this.runTargetJob(job.type)
    }

    this.logger.info('Scheduler done')
  }
}
