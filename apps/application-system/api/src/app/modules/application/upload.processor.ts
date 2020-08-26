import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import * as AmazonS3URI from 'amazon-s3-uri'
import { ApplicationService } from './application.service'
import { FileStorageService } from '@island.is/file-storage'

interface IJobData {
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
    const { attachmentUrl }: IJobData = job.data
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
    const { applicationId, attachmentUrl }: IJobData = job.data
    const { key } = AmazonS3URI(url)

    const existingApplication = await this.applicationService.findById(
      applicationId,
    )

    if (!existingApplication.attachments.hasOwnProperty(key)) {
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
