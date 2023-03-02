import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

import { sessionsQueueName, sessionJobName } from '../sessions.config'
import { Session } from '../sessions/session.model'
import { SessionsService } from '../sessions/sessions.service'

@Processor(sessionsQueueName)
export class SessionsProcessor {
  constructor(private readonly sessionsService: SessionsService) {}

  @Process(sessionJobName)
  handleSessionActivity(job: Job<Session>): Promise<Session> {
    return this.sessionsService.create(job.data)
  }
}
