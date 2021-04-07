import { S3 } from 'aws-sdk'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { PresignedPost } from './models'

@Injectable()
export class AwsS3Service {
  private readonly s3: S3

  constructor() {
    this.s3 = new S3({ region: environment.files.region })
  }

  async createPresignedPost(key: string): Promise<PresignedPost> {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(
        {
          Bucket: environment.files.bucket,
          Expires: +environment.files.timeToLivePost,
          Fields: { key },
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        },
      )
    })
  }
}
