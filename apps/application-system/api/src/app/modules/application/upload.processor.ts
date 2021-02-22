import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { ApplicationService } from './application.service'
import { FileStorageService } from '@island.is/file-storage'
import { Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { applicationConfiguration } from './application.configuration'
import AmazonS3URI from 'amazon-s3-uri'

interface JobData {
  applicationId: string
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
    @Inject(applicationConfiguration.KEY)
    private readonly config: ConfigType<typeof applicationConfiguration>,
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
    const url = await this.fileStorageService.copyObjectFromUploadBucket(
      sourceKey,
      destinationBucket,
      destinationKey,
    )

    const resultUrl = `https://${destinationBucket}.s3-${this.config.region}.amazonaws.com/${destinationKey}`
    return {
      attachmentKey: sourceKey,
      resultUrl,
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: JobResult) {
    const { applicationId }: JobData = job.data

    const existingApplication = await this.applicationService.findById(
      applicationId,
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

    // Update application attatchments
    return await this.applicationService.update(job.data.applicationId, {
      attachments: {
        ...(existingApplication?.attachments ?? {}),
        [result.attachmentKey]: result.resultUrl,
      },
    })
  }
}
