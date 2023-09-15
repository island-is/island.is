import { S3 } from 'aws-sdk'

import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'

import { awsS3ModuleConfig } from './awsS3.config'

@Injectable()
export class AwsS3Service {
  private readonly s3: S3

  constructor(
    @Inject(awsS3ModuleConfig.KEY)
    private readonly config: ConfigType<typeof awsS3ModuleConfig>,
  ) {
    this.s3 = new S3({ region: this.config.region })
  }

  createPresignedPost(key: string, type: string): Promise<S3.PresignedPost> {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(
        {
          Bucket: this.config.bucket,
          Expires: +this.config.timeToLivePost, // convert to number with +
          Fields: {
            key,
            'content-type': type,
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

  getSignedUrl(key: string): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl(
        'getObject',
        {
          Bucket: this.config.bucket,
          Key: key,
          Expires: +this.config.timeToLiveGet, // convert to number with +
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

  async deleteObject(key: string): Promise<boolean> {
    return this.s3
      .deleteObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise()
      .then(() => true)
  }

  objectExists(key: string): Promise<boolean> {
    return this.s3
      .headObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise()
      .then(
        () => true,
        () => {
          // The error is either 404 Not Found or 403 Forbidden.
          // Normally, we would check if the error is 404 Not Found.
          // However, to avoid granting the service ListBucket permissions,
          // we also allow 403 Forbidden.
          return false
        },
      )
  }

  async getObject(key: string): Promise<Buffer> {
    return this.s3
      .getObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise()
      .then((data) => data.Body as Buffer)
  }

  async putObject(key: string, content: string): Promise<string> {
    return this.s3
      .putObject({
        Bucket: this.config.bucket,
        Key: key,
        Body: Buffer.from(content, 'binary'),
        ContentType: 'application/pdf',
      })
      .promise()
      .then(() => key)
  }

  async copyObject(key: string, newKey: string): Promise<string> {
    return this.s3
      .copyObject({
        Bucket: this.config.bucket,
        Key: newKey,
        CopySource: encodeURIComponent(`${this.config.bucket}/${key}`),
      })
      .promise()
      .then(() => newKey)
  }
}
