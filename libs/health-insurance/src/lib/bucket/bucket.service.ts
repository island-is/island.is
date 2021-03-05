import { Inject, Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class BucketService {
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' })
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  /* */
  async getFileContentAsBase64(
    filename: string,
    bucketName: string,
  ): Promise<string> {
    this.logger.info('getFileContent base64...')
    try {
      const sm = await this.getFile(filename, bucketName)
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
