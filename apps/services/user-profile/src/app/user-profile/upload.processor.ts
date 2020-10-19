import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as AmazonS3URI from 'amazon-s3-uri'
<<<<<<< HEAD
import * as AWS from 'aws-sdk'
=======
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
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
    private readonly fileStorageService: FileStorageService,
<<<<<<< HEAD
  ) { }
=======
  ) {}
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e

  @Process('upload')
  async handleUpload(job: Job): Promise<string> {
    const { attachmentUrl }: JobData = job.data

    const { bucket, key } = AmazonS3URI(attachmentUrl)
<<<<<<< HEAD
    const destinationBucket = 'sendiradid-test-bucket-two'
    const region = 'eu-west-1'
    console.log('upload')
    console.log('size ', await this.sizeOf(key, bucket));

    const ret = await this.fileStorageService.copyObjectFromUploadBucket(
=======
    const destinationBucket = 'test'
    const region = 'eu-west-1'

    return await this.fileStorageService.copyObjectFromUploadBucket(
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
      key,
      destinationBucket,
      region,
      bucket,
    )
<<<<<<< HEAD

    return ret
  }

  async sizeOf(key, bucket): Promise<string> {
    console.log('key ', key);
    console.log('bucket ', bucket);

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    const size = await new Promise((resolve, reject) => {

      s3.headObject({ Key: key, Bucket: bucket }, (err, data) => {
        console.log('headopkce', data)
        console.log('err', err)
        if (err) {
          reject(err)
        } else {
          resolve(data.ContentLength)
        }
      })
    })

    return this.bytesToSize(size as number)
  }


  bytesToSize(bytes: number) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';

    var i = (Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
=======
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, url: string) {
<<<<<<< HEAD
    const { nationalId }: JobData = job.data.profile
=======
    const { nationalId }: JobData = job.data
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e

    return await this.userProfileService.update(nationalId, {
      profileImageUrl: url,
    })
  }
}
