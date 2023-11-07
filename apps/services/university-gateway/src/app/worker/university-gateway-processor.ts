import {
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull'
import { Inject } from '@nestjs/common'
import { Job } from 'bull'
import { AuditService } from '@island.is/nest/audit'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InternalProgramService } from '../modules/program/internalProgram.service'
import { InternalCourseService } from '../modules/course/internalCourse.service'

@Processor('university-gateway')
export class UniversityGatewayProcessor {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly auditService: AuditService,
    private readonly internalProgramService: InternalProgramService,
    private readonly internalCourseService: InternalCourseService,
  ) {}

  @Process('university-gateway')
  async handleRunJob(job: Job) {
    this.logger.debug(`Processing job ${job.id}`, { job })
    await this.internalProgramService.updatePrograms()
    this.internalCourseService.updateCourses()
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
      namespace: '@island.is/university-gateway/worker',
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
