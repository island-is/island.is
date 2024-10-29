import {
  CopyObjectCommand,
  CopyObjectCommandOutput,
  CopyObjectRequest,
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import AmazonS3URI from 'amazon-s3-uri'
import { Inject, Injectable } from '@nestjs/common'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Upload } from '@aws-sdk/lib-storage'
import {
  createPresignedPost,
  PresignedPost,
  PresignedPostOptions,
} from '@aws-sdk/s3-presigned-post'
import stream from 'stream'

export interface BucketKeyPair {
  bucket: string
  key: string
}

export type EncodingString = 'base64' | 'binary'

@Injectable()
export class S3Service {
  constructor(
    @Inject(S3Client) private s3Client: S3Client,
    @Inject(LOGGER_PROVIDER) protected readonly logger: Logger,
  ) {}

  public async getClientRegion(): Promise<string> {
    return await this.s3Client.config.region()
  }

  public async getFile(
    BucketKeyPairOrFilename: BucketKeyPair | string,
  ): Promise<GetObjectCommandOutput | undefined> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    return this.getFileResponse(bucket, key)
  }

  public async getFileContent(
    BucketKeyPairOrFilename: BucketKeyPair | string,
    encoding?: EncodingString | undefined,
  ): Promise<string | undefined> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    const result = await this.getFileResponse(bucket, key)
    return result?.Body?.transformToString(encoding)
  }

  public async copyObject(
    BucketKeyPairOrFilename: BucketKeyPair | string,
    copySource: string,
  ): Promise<CopyObjectCommandOutput> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    const input: CopyObjectRequest = {
      Bucket: bucket,
      Key: key,
      CopySource: copySource,
    }
    try {
      return await this.s3Client.send(new CopyObjectCommand(input))
    } catch (error) {
      this.logger.error(
        `Error occurred while copying file: ${key} to S3 bucket: ${bucket} from ${copySource}`,
        error,
      )
      throw error
    }
  }

  public async putObject(
    BucketKeyPairOrFilename: BucketKeyPair | string,
    content: Buffer,
    contentType: string,
  ): Promise<string> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    const input: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: content,
      ContentType: contentType,
    }
    try {
      await this.s3Client.send(new PutObjectCommand(input))
      return key
    } catch (error) {
      this.logger.error(
        `Error occurred while putting file: ${key} to S3 bucket: ${bucket}`,
        error,
      )
      throw error
    }
  }

  public async uploadFile(
    content: Buffer | NodeJS.ReadableStream,
    BucketKeyPairOrFilename: BucketKeyPair | string,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    const isStreaming = !(content instanceof Buffer)
    let uploadStream: stream.PassThrough | undefined
    
    if(isStreaming)
      uploadStream = new stream.PassThrough()
       
    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: isStreaming ? uploadStream : content,
      ...uploadParameters,
    }

    try {
      const parallelUpload = new Upload({
        client: this.s3Client,
        params: uploadParams,
      })

      if(isStreaming && uploadStream)
        content.pipe(uploadStream)

      const { Location: url } = await parallelUpload.done()

      if (!url)
        throw new Error('No location url found after uploading file to S3')

      return url
    } catch (error) {
      this.logger.error(
        `Error occurred while uploading file: ${key} to S3 bucket: ${bucket}`,
        error,
      )
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
    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiration,
    })
  }

  public async createPresignedPost(
    params: PresignedPostOptions,
  ): Promise<PresignedPost> {
    try {
      return await createPresignedPost(this.s3Client, params)
    } catch (error) {
      this.logger.error(
        `An error occurred while trying to create a presigned post for file: ${params.Key} in bucket: ${params.Bucket}`,
        error,
      )
      throw new Error(
        `An error occurred while trying to create a presigned post ${error.message}`,
      )
    }
  }

  public async fileExists(
    BucketKeyPairOrFilename: BucketKeyPair | string,
  ): Promise<boolean> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    try {
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
      const results = await this.s3Client.send(command)

      return results.$metadata.httpStatusCode === 200
    } catch (error) {
      // To avoid granting the service ListBucket permissions, we also allow 403 Forbidden.
      if (
        error?.$metadata?.httpStatusCode === 404 ||
        error?.$metadata?.httpStatusCode === 403
      )
        return false

      this.logger.error(
        `Error occurred while checking if file: ${key} exists in S3 bucket: ${bucket}`,
        error,
      )
      return false
    }
  }

  public async deleteObject(
    BucketKeyPairOrFilename: BucketKeyPair | string,
  ): Promise<boolean> {
    const { bucket, key } = this.getBucketKey(BucketKeyPairOrFilename)
    try {
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
      return true
    } catch (error) {
      this.logger.error(
        `Error occurred while deleting file: ${key} from S3 bucket: ${bucket}`,
        error,
      )
      return false
    }
  }

  public getBucketKey(BucketKeyPairOrFilename: BucketKeyPair | string): {
    bucket: string
    key: string
  } {
    if (typeof BucketKeyPairOrFilename === 'object') {
      return BucketKeyPairOrFilename
    } else {
      try {
        return AmazonS3URI(BucketKeyPairOrFilename)
      } catch (error) {
        this.logger.error(
          `Invalid S3 URI provided: ${BucketKeyPairOrFilename}`,
          error,
        )
        throw new Error('Invalid S3 URI provided')
      }
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
      this.logger.error(
        `Error occurred while fetching file: ${key} from S3 bucket: ${bucket}`,
        error,
      )
      return undefined
    }
  }
}
