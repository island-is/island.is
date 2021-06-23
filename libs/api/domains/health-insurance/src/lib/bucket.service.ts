import { Inject, Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
// import * as AmazonS3URI from 'amazon-s3-uri'

const BUCKET_NAME = 'island-is-dev-storage-application-system'

@Injectable()
export class BucketService {
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' })
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  /* */
  async getFileContentAsBase64(filename: string): Promise<string> {
    this.logger.info('getFileContent base64...')
    try {
      const sm = await this.getFile(filename)
      if (sm.Body) {
        this.logger.info('found file:' + filename)
        return sm.Body.toString('base64')
      } else {
        throw new Error('error getting file:' + filename)
      }
    } catch (error) {
      this.logger.error(error.message)
      throw new Error(error.message)
    }
  }
  /* */
  async getFileFromUrl(urlToFile: string): Promise<S3.GetObjectOutput> {
    const spurl = urlToFile.split('/')
    const fn = spurl[spurl.length - 1]
    // console.log(fn)
    return this.getFile(fn)
  }

  /* */
  async getFile(filename: string): Promise<S3.GetObjectOutput> {
    this.logger.info('get bucket file:' + filename)
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: BUCKET_NAME,
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
