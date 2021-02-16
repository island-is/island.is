import { Inject, Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { uuid } from 'uuidv4'
import { ConfigType } from '@nestjs/config'
import { fileStorageConfiguration } from './file-storage.configuration'

const PRESIGNED_POST_EXPIRES = 1000 * 60 * 5

@Injectable()
export class FileStorageService {
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' })
  private uploadBucket?: string

  constructor(
    @Inject(fileStorageConfiguration.KEY)
    private readonly config: ConfigType<typeof fileStorageConfiguration>,
  ) {}

  generatePresignedPost(filename: string): Promise<AWS.S3.PresignedPost> {
    if (!this.config.uploadBucket) {
      throw new Error('Upload bucket not configured.')
    }

    const fileId = uuid()
    const key = `${fileId}_${filename}`

    const params = {
      Bucket: this.config.uploadBucket,
      Expires: PRESIGNED_POST_EXPIRES,
      Fields: {
        key,
      },
      conditions: [['content-length-range', 0, 10000000]], // Max 10MB
    }

    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async copyObjectFromUploadBucket(
    key: string,
    destinationBucket: string,
    region: string,
    sourceBucket: string,
  ): Promise<string> {
    const params = {
      Key: key,
      Bucket: destinationBucket,
      CopySource: `${sourceBucket}/${key}`,
    }

    return new Promise((resolve, reject) => {
      this.s3.copyObject(params, (err) => {
        if (err) {
          reject(err)
        } else {
          const url = `https://${destinationBucket}.s3-${region}.amazonaws.com/${key}`

          resolve(url)
        }
      })
    })
  }
}
