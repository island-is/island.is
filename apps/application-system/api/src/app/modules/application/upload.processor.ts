import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as AmazonS3URI from 'amazon-s3-uri'
import { ApplicationService } from './application.service'
import { FileStorageService } from '@island.is/file-storage'
import { Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { applicationConfiguration } from './application.configuration'

interface JobData {
  applicationId: string
  attachmentUrl: string
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
  async handleUpload(job: Job) {
    const { attachmentUrl }: JobData = job.data
    const { bucket, key } = AmazonS3URI(attachmentUrl)
    const attachmentBucket = this.config.attachmentBucket

    if (!attachmentBucket) {
      throw new Error('Application attachment bucket not configured.')
    }

    return await this.fileStorageService.copyObjectFromUploadBucket(
      key,
      attachmentBucket,
      this.config.region,
      bucket,
    )
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, url: string) {
    const { applicationId }: JobData = job.data
    const { key } = AmazonS3URI(url)

    const existingApplication = await this.applicationService.findById(
      applicationId,
    )

    if (
      existingApplication &&
      !Object.prototype.hasOwnProperty.call(
        existingApplication.attachments,
        key,
      )
    ) {
      return
    }

    // Update application attatchments
    return await this.applicationService.update(job.data.applicationId, {
      attachments: {
        ...(existingApplication?.attachments ?? {}),
        [key]: url,
      },
    })
  }
}
