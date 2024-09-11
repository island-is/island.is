import {
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3'
import AmazonS3URI from 'amazon-s3-uri'
import { Inject, Injectable } from '@nestjs/common'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
/*
@Injectable()
export class S3Service {
  constructor(
    @Inject(S3Client) private s3Client: S3Client,
    @Inject(LOGGER_PROVIDER) protected readonly logger: Logger,
  ) {}

  public async getSignedUrlPromise(
    bucket: string,
    key: string,
    expiration: number,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key })
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiration,
      })
      return url ?? ''
    } catch (error) {
      this.logger.error('Error occurred while fetching file from S3')
      this.logger.error(error)
      return ''
    }
  }

  public async getFileFromBucket(
    bucket: string,
    key: string,
  ): Promise<GetObjectCommandOutput | undefined> {
    return await this.getBucketContent(bucket, key)
  }

  public async getFileContentAsBase64(
    fileName: string,
  ): Promise<string | undefined> {
    const { bucket, key } = AmazonS3URI(fileName)
    return this.getBase64Content(bucket, key)
  }

  public async getFileContentAsBase64FromBucket(
    bucket: string,
    key: string,
  ): Promise<string | undefined> {
    return await this.getBase64Content(bucket, key)
  }

  private async getBase64Content(
    bucket: string, 
    key: string
  ): Promise<string | undefined> {
    const result = await this.getBucketContent(bucket, key)
    return await result?.Body?.transformToString('base64')
  }

  private async getBucketContent(
    bucket: string, 
    key: string
  ): Promise<GetObjectCommandOutput | undefined> {
    try {
      return await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      )
    } catch (error) {
      this.logger.error('Error occurred while fetching file from S3')
      this.logger.error(error)
      return undefined
    }
  }
}
*/