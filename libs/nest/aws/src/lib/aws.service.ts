import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import AmazonS3URI from 'amazon-s3-uri'
import { Inject, Injectable } from '@nestjs/common'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Upload } from '@aws-sdk/lib-storage'

export interface BucketKeyPair {
  bucket: string
  key: string
}

@Injectable()
export class AwsService {
  constructor(
    @Inject(S3Client) private s3Client: S3Client,
    @Inject(LOGGER_PROVIDER) protected readonly logger: Logger,
  ) {}

  public async getFile(
    BucketKeyPairOrFilename: BucketKeyPair | string,
  ): Promise<GetObjectCommandOutput | undefined> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    return this.getFileResponse(bucket, key)
  }

  public async getFileContent(
    BucketKeyPairOrFilename: BucketKeyPair | string,
    encoding?: string | undefined,
  ): Promise<string | undefined> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    const result = await this.getFileResponse(bucket, key)
    return await result?.Body?.transformToString(encoding)
  }

  public async uploadFile(
    content: Buffer,
    BucketKeyPairOrFilename: BucketKeyPair | string,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: content,
      ...uploadParameters,
    }

    try {
      const parallelUploads3 = new Upload({
        client: this.s3Client,
        params: uploadParams,
      })

      const { Location: url } = await parallelUploads3.done()

      if (!url)
        throw new Error('No location url found after uploading file to S3')

      return url
    } catch (error) {
      this.logger.error('Error occurred while uploading file to S3', error)
      throw error
    }
  }

  public async getPresignedUrl(
    BucketKeyPairOrFilename: BucketKeyPair | string,
    expirationOverride?: number,
  ): Promise<string> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)

    // TODO: Select default length for presigned url's in island.is
    const oneMinute = 60
    const expiration = expirationOverride ?? oneMinute * 120

    const command = new GetObjectCommand({ Bucket: bucket, Key: key })
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiration,
    })

    return url
  }

  public async fileExists(
    BucketKeyPairOrFilename: BucketKeyPair | string,
  ): Promise<boolean> {
    try {
      const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
      const results = await this.s3Client.send(command)

      const exists = results.$metadata.httpStatusCode === 200
      return exists
    } catch (error) {
      if (error.$metadata?.httpStatusCode === 404) {
        // doesn't exist and permission policy includes s3:ListBucket
        return false
      } else if (error.$metadata?.httpStatusCode === 403) {
        // doesn't exist, permission policy WITHOUT s3:ListBucket
        return false
      } else {
        // some other error
        this.logger.error(
          'Error occurred while checking if file exists in S3',
          error,
        )
        return false
      }
    }
  }

  public async deleteObject(BucketKeyPairOrFilename: BucketKeyPair | string) {
    try {
      const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
      const result = await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      )

      if (
        result.$metadata.httpStatusCode !== 204 &&
        result.$metadata.httpStatusCode !== 200
      ) {
        throw new Error('Unexpected http response when deleting object from S3')
      }
    } catch (error) {
      this.logger.error('Error occurred while deleteing file from S3', error)
    }
  }

  private async getFileResponse(
    bucket: string,
    key: string,
  ): Promise<GetObjectCommandOutput | undefined> {
    try {
      return await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      )
    } catch (error) {
      this.logger.error('Error occurred while fetching file from S3', error)
      return undefined
    }
  }

  private getBucketKey(BucketKeyPairOrFilename: BucketKeyPair | string): {
    bucket: string
    key: string
  } {
    return typeof BucketKeyPairOrFilename === 'object'
      ? BucketKeyPairOrFilename
      : AmazonS3URI(BucketKeyPairOrFilename)
  }
}
