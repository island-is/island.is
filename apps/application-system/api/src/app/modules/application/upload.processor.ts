import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { ApplicationService } from '@island.is/application/api/core'
import { FileStorageService } from '@island.is/file-storage'
import { Inject } from '@nestjs/common'
import type { ApplicationConfig } from './application.configuration'
import { APPLICATION_CONFIG } from './application.configuration'
import AmazonS3URI from 'amazon-s3-uri'

interface JobData {
  applicationId: string
  nationalId: string
  attachmentUrl: string
}

interface JobResult {
  attachmentKey: string
  resultUrl: string
}

@Processor('upload')
export class UploadProcessor {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly fileStorageService: FileStorageService,
    @Inject(APPLICATION_CONFIG)
    private readonly config: ApplicationConfig,
  ) {}

  @Process('upload')
  async handleUpload(job: Job<JobData>): Promise<JobResult> {
    const { attachmentUrl, applicationId } = job.data
    const destinationBucket = this.config.attachmentBucket

    if (!destinationBucket) {
      throw new Error('Application attachment bucket not configured.')
    }

    const { key: sourceKey } = AmazonS3URI(attachmentUrl)
    const destinationKey = `${applicationId}/${sourceKey}`
    const resultUrl = await this.fileStorageService.copyObjectFromUploadBucket(
      sourceKey,
      destinationBucket,
      destinationKey,
    )

    return {
      attachmentKey: sourceKey,
      resultUrl,
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: JobResult) {
    const { applicationId, nationalId }: JobData = job.data
    const existingApplication = await this.applicationService.findOneById(
      applicationId,
      nationalId,
    )

    if (
      existingApplication &&
      !Object.prototype.hasOwnProperty.call(
        existingApplication.attachments,
        result.attachmentKey,
      )
    ) {
      return
    }

    return await this.applicationService.updateAttachment(
      applicationId,
      nationalId,
      result.attachmentKey,
      result.resultUrl,
    )
  }
}
