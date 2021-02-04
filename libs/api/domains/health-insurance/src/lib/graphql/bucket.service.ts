import { Inject, Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

const BUCKET_NAME = 'dev-island-is-sjukra'
const REGION = 'eu-west-1'

const s3 = new AWS.S3({
  region: REGION,
})

@Injectable()
export class BucketService {
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
  async getFile(fileToGet: string): Promise<S3.GetObjectOutput> {
    this.logger.info('get bucket file:' + fileToGet)
    return new Promise((resolve, reject) => {
      s3.createBucket(
        {
          Bucket: BUCKET_NAME,
        },
        function () {
          const params = {
            Bucket: BUCKET_NAME,
            Key: fileToGet,
          }
          s3.getObject(params, function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        },
      )
    })
  }
}
