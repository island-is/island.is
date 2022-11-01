import { Inject, Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import AmazonS3URI from 'amazon-s3-uri'

@Injectable()
export class BucketService {
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' })
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  async getFileContentAsBase64(filename: string): Promise<string> {
    this.logger.info('getFileContent base64...')
    try {
      const { region, bucket, key } = AmazonS3URI(filename)
      const sm = await this.getFile(key, bucket)
      if (sm.Body) {
        this.logger.info('found file:' + key)
        return sm.Body.toString('base64')
      } else {
        throw new Error('error getting file:' + key)
      }
    } catch (error) {
      this.logger.error(error.message)
      throw new Error(error.message)
    }
  }

  async getFile(
    filename: string,
    bucketName: string,
  ): Promise<S3.GetObjectOutput> {
    this.logger.info('get bucket file:' + filename)
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Key: filename,
      }
      this.s3.getObject(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
