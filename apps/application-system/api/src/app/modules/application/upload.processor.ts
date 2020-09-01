import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import * as AmazonS3URI from 'amazon-s3-uri'
import { ApplicationService } from './application.service'
import { FileStorageService } from '@island.is/file-storage'

interface JobData {
  applicationId: string
  attachmentUrl: string
}

@Processor('upload')
export class UploadProcessor {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @Process('upload')
  async handleUpload(job: Job) {
    const { attachmentUrl }: JobData = job.data
    console.log('Start uploading...')
    const { bucket, key } = AmazonS3URI(attachmentUrl)
    const destinationBucket = 'testing-islandis-copy'
    const region = 'eu-west-1'

    return await this.fileStorageService.copyObjectFromUploadBucket(
      key,
      destinationBucket,
      region,
      bucket,
    )
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, url: string) {
    console.log('On completed: job ', job.id, ' -> result: ', url)
    const { applicationId }: JobData = job.data
    const { key } = AmazonS3URI(url)

    const existingApplication = await this.applicationService.findById(
      applicationId,
    )

    if (
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
        ...existingApplication.attachments,
        [key]: url,
      },
    })
  }
}
