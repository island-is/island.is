import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import AmazonS3URI from 'amazon-s3-uri'
import { logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class S3Service {
  constructor(@Inject(S3Client) private s3Client: S3Client) {}

  public async getFileContentAsBase64(
    fileName: string,
  ): Promise<string | undefined> {
    const { bucket, key } = AmazonS3URI(fileName)
    const uploadBucket = bucket
    try {
      const { Body } = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: uploadBucket,
          Key: key,
        }),
      )

      return await Body?.transformToString('base64')
    } catch (error) {
      logger.error('Error occurred while fetching file from S3')
      logger.error(error)
      return undefined
    }
  }
}
