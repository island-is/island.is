import { Job } from 'bull';

import { Process, Processor } from '@nestjs/bull';

import { activitiesQueueName, sessionJobName } from '../activities.config';
import { Session } from '../sessions/session.model';
import { SessionsService } from '../sessions/sessions.service';

@Processor(activitiesQueueName)
export class ActivitiesProcessor {
  constructor(private readonly sessionsService: SessionsService) {}

  @Process(sessionJobName)
  handleSessionActivity(job: Job<Session>): Promise<Session> {
    return this.sessionsService.create(job.data)
  }
}
