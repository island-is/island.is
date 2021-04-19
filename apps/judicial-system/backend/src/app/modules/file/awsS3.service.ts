import { S3 } from 'aws-sdk'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { DeleteFileResponse, PresignedPost, SignedUrl } from './models'

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
          Expires: +environment.files.timeToLivePost, // convert to number with +
          Fields: {
            key,
            'content-type': '',
            'Content-Disposition': 'inline',
          },
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

  async getSignedUrl(key: string): Promise<SignedUrl> {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl(
        'getObject',
        {
          Bucket: environment.files.bucket,
          Key: key,
          Expires: +environment.files.timeToLiveGet, // convert to number with +
        },
        (err, url) => {
          if (err) {
            reject(err)
          } else {
            resolve({ url })
          }
        },
      )
    })
  }

  async deleteObject(key: string): Promise<DeleteFileResponse> {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: environment.files.bucket,
          Key: key,
        },
        (err, _) => {
          if (err) {
            reject(err)
          } else {
            resolve({ success: true })
          }
        },
      )
    })
  }
}
