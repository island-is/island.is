import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as AmazonS3URI from 'amazon-s3-uri'
import { FileStorageService } from '@island.is/file-storage'
import { UserProfileService } from './userProfile.service'

interface JobData {
  nationalId: string
  attachmentUrl: string
}

@Processor('upload')
export class UploadProcessor {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly fileStorageService: FileStorageService
  ) { }

  @Process('upload')
  async handleUpload(job: Job): Promise<string> {
    const { attachmentUrl }: JobData = job.data

    const { bucket, key } = AmazonS3URI(attachmentUrl)
    const destinationBucket = 'test'
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

    const { nationalId }: JobData = job.data

    const { key } = AmazonS3URI(url)
    return await this.userProfileService
      .update(nationalId, { profileImageUrl: url })
  }
}
