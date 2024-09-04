import {
  CompleteMultipartUploadCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import AmazonS3URI from 'amazon-s3-uri'
import { logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ApplicationWithAttachments } from '@island.is/application/types'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import stream from 'stream'
import { Response } from 'node-fetch'
import { Upload } from '@aws-sdk/lib-storage'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

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
    try {
      const result = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      )

      return result
    } catch (error) {
      this.logger.error('Error occurred while fetching file from S3')
      this.logger.error(error)
      return undefined
    }
  }

  public async getFileFromApplicationWithAttachments(
    application: ApplicationWithAttachments,
    attachmentKey: string,
  ): Promise<GetObjectCommandOutput | undefined> {
    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    const { bucket, key } = AmazonS3URI(fileName)
    const uploadBucket = bucket
    try {
      const result = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: uploadBucket,
          Key: key,
        }),
      )

      return result
    } catch (error) {
      this.logger.error('Error occurred while fetching file from S3')
      this.logger.error(error)
      return undefined
    }
  }

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
      this.logger.error('Error occurred while fetching file from S3')
      this.logger.error(error)
      return undefined
    }
  }

  public async getFileContentAsBase64FromBucket(
    bucket: string,
    key: string,
  ): Promise<string | undefined> {
    try {
      const { Body } = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      )

      return await Body?.transformToString('base64')
    } catch (error) {
      this.logger.error('Error occurred while fetching file from S3')
      this.logger.error(error)
      return undefined
    }
  }

  public async uploadFileFromStream(
    stream: Response,
    filename: string,
    bucket: string,
  ): Promise<string | null> {
    const { passThrough, donePromise } = this.uploadFromStream(filename, bucket)

    stream.body.pipe(passThrough)

    const result = await donePromise
    const oneMinutePlus = 65 // leave extra 5 seconds for network delay
    try {
      const signedUrl = await this.getSignedUrlPromise(
        bucket,
        result.Key ?? '',
        oneMinutePlus,
      )
      if (!signedUrl) {
        throw new Error('Unable to get signed url from uploaded data')
      }
      return signedUrl
    } catch (error) {
      this.logger.error('Error occurred while fetching file from S3')
      this.logger.error(error)
      return null
    }
  }

  private uploadFromStream(
    fileName: string,
    bucket: string,
  ): {
    passThrough: stream.PassThrough
    donePromise: Promise<CompleteMultipartUploadCommandOutput>
  } {
    const passThrough = new stream.PassThrough()
    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: fileName,
      Body: passThrough,
      ContentLength: passThrough.readableLength,
      ContentType: 'application/pdf',
    }

    const donePromise = new Upload({
      client: this.s3Client,
      params: uploadParams,
    }).done()

    return { passThrough, donePromise }
  }
}
