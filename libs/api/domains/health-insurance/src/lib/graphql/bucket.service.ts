import { Inject, Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { ListObjectsOutput } from 'aws-sdk/clients/s3'
import * as S3 from 'aws-sdk/clients/s3'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

const BUCKET_NAME = 'dev-island-is-sjukra'
const REGION = 'eu-west-1'

const s3 = new AWS.S3({
  region: REGION,
})

export interface Base64FileType {
  body: string
  fileName: string
  contentType: string
}

@Injectable()
export class BucketService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  /* TEST */
  async getFileContent(filename: string): Promise<Base64FileType | undefined> {
    this.logger.info('getFileContent...')
    try {
      //todo ath með undefined
      const sm = await this.getFile(filename)
      this.logger.debug(JSON.stringify(sm))
      if (sm.Body && sm.ContentType) {
        return {
          fileName: filename,
          contentType: sm.ContentType,
          body: sm.Body.toString('base64'),
        }
      } else {
        throw new Error('file not found')
      }
    } catch (error) {
      this.logger.error('error getting file:' + filename)
      this.logger.error(error.message)
      throw new Error(error.message)
    }
  }

  /* TEST */
  async getList(): Promise<ListObjectsOutput> {
    this.logger.info('get bucket list...')
    const list = await s3.listObjects({ Bucket: BUCKET_NAME }).promise()
    return list
  }

  /* TEST */
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
