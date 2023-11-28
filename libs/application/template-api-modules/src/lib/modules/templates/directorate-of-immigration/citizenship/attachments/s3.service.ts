import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import AmazonS3URI from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'

@Injectable()
export class S3Service {
  constructor(private readonly s3: S3) {}

  public async getFilecontentAsBase64(
    filUri: string,
  ): Promise<string | undefined> {
    const { bucket, key } = AmazonS3URI(filUri)
    const uploadBucket = bucket
    try {
      const file = await this.s3
        .getObject({
          Bucket: uploadBucket,
          Key: key,
        })
        .promise()

      const fileContent = file.Body as Buffer
      return fileContent?.toString('base64')
    } catch (error) {
      logger.error(error)
      return undefined
    }
  }
}
