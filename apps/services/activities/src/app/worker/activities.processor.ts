import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  ActivitiesConfig,
  activitiesQueueName,
  sessionJobName,
} from '../activities.config'
import { SessionsService } from '../sessions/sessions.service'
import { Session } from '../sessions/session.model'

@Processor(activitiesQueueName)
export class ActivitiesProcessor {
  constructor(
    private readonly sessionsService: SessionsService,
    @Inject(ActivitiesConfig.KEY)
    private config: ConfigType<typeof ActivitiesConfig>,
  ) {}

  @Process(sessionJobName)
  handleSessionActivity(job: Job<Session>): Promise<Session> {
    return this.sessionsService.create(job.data)
  }
}
