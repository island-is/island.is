import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { activitiesQueueName, sessionJobName } from '../activities.config'
import { SessionsService } from '../sessions/sessions.service'
import { Session } from '../sessions/session.model'

@Processor(activitiesQueueName)
export class ActivitiesProcessor {
  constructor(private readonly sessionsService: SessionsService) {}

  @Process(sessionJobName)
  handleSessionActivity(job: Job<Session>): Promise<Session> {
    return this.sessionsService.create(job.data)
  }
}
