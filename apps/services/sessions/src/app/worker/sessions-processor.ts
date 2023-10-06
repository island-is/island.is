import {
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull'
import { Inject } from '@nestjs/common'
import type { Job } from 'bull'

import type { AuditService } from '@island.is/nest/audit'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { sessionsQueueName, sessionJobName } from '../sessions.config'
import type { SessionsService } from '../sessions/sessions.service'
import type { CreateSessionDto } from '../sessions/create-session.dto'

@Processor(sessionsQueueName)
export class SessionsProcessor {
  constructor(
    private readonly sessionsService: SessionsService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly auditService: AuditService,
  ) {}

  @Process(sessionJobName)
  handleSessionActivity(job: Job<CreateSessionDto>) {
    this.logger.debug(`Processing job ${job.id}`, { job })
    return this.sessionsService.create(job.data)
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job) {
    this.logger.debug(`Job ${job.id} completed`, { job })
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed with error: ${error.message}`)
    this.auditService.audit({
      system: true,
      namespace: '@island.is/sessions/worker',
      action: 'queue-job-failed',
      resources: job.id.toString(),
      meta: {
        job,
      },
    })
  }

  @OnQueueError()
  onQueueError(error: Error) {
    this.logger.error(`Queue error: ${error.message}`, { error })
  }

  @OnQueueStalled()
  onQueueStalled(job: Job) {
    this.logger.error(`Job ${job.id} stalled`, { job })
  }
}
