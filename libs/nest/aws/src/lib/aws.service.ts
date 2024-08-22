import { Injectable } from '@nestjs/common'
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3'
import AmazonS3Uri from 'amazon-s3-uri'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const MINUTE = 60
const HOUR = 60 * MINUTE
export type Encoding = 'binary' | 'base64' | 'utf-8'

interface GetFileOptions {
  bucket?: string
  fileName?: string
  s3Uri?: string
}

interface GetEncodedFileOptions extends GetFileOptions {
  encoding?: Encoding
}

@Injectable()
export class AwsService {
  s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({})
  }

  async getFile(options: GetFileOptions): Promise<GetObjectCommandOutput> {
    let { bucket, fileName } = options

    if (options.s3Uri) {
      const uri = AmazonS3Uri(options.s3Uri)
      bucket = uri.bucket
      fileName = uri.key
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileName,
    })

    return await this.s3Client.send(command)
  }

  async getFileEncoded(
    options: GetEncodedFileOptions,
  ): Promise<string | undefined> {
    const encoding = options.encoding || 'base64'
    const out = await this.getFile(options)
    return out.Body?.transformToString(encoding)
  }

  async getFileBase64(options: GetFileOptions): Promise<string | undefined> {
    return await this.getFileEncoded({ ...options, encoding: 'base64' })
  }

  async uploadFile(
    content: Buffer,
    bucket: string,
    fileName: string,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: content,
      ...uploadParameters,
    })

    await this.s3Client.send(command)
    return `https://${bucket}.s3.amazonaws.com/${fileName}`
  }

  async getPresignedUrl(
    bucket: string,
    fileName: string,
    TTL = 2 * HOUR, // TODO: Select length for presigned url's in island.is
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileName,
    })

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: TTL,
    })
  }

  public async fileExists(bucket: string, fileName: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: fileName,
    })

    return await this.s3Client
      .send(command)
      .then(() => true)
      .catch((error) => {
        if (error.name === 'NotFound') {
          return false
        }
        throw error
      })
  }

  public async deleteObject(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    return await this.s3Client.send(command)
  }
}
