import { Inject, Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { uuid } from 'uuidv4'
import {
  FILE_STORAGE_CONFIG,
  FileStorageConfig,
} from './file-storage.configuration'
import AmazonS3URI from 'amazon-s3-uri'

const PRESIGNED_POST_EXPIRES = 1000 * 60 * 5
const SIGNED_GET_EXPIRES = 10 * 60

@Injectable()
export class FileStorageService {
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' })

  constructor(
    @Inject(FILE_STORAGE_CONFIG)
    private readonly config: FileStorageConfig,
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

  public generateSignedUrl(url: string, key: string): Promise<string> {
    const { bucket } = AmazonS3URI(url)
    const params = { Bucket: bucket, Expires: SIGNED_GET_EXPIRES, Key: key }
    return this.s3.getSignedUrlPromise('getObject', params)
  }

  async copyObjectFromUploadBucket(
    sourceKey: string,
    destinationBucket: string,
    destinationKey: string,
  ): Promise<string> {
    if (!this.config.uploadBucket) {
      throw new Error('Upload bucket not configured.')
    }

    const params = {
      Key: destinationKey,
      Bucket: destinationBucket,
      CopySource: `${this.config.uploadBucket}/${sourceKey}`,
    }
    const region = this.s3.config.region

    await this.s3.copyObject(params).promise()
    return `https://${destinationBucket}.s3-${region}.amazonaws.com/${destinationKey}`
  }
}
