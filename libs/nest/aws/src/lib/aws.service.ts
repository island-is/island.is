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
type Encoding = 'binary' | 'base64' | 'utf-8'

@Injectable()
export class AwsService {
  s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({})
  }

  async getFile(fileName: string): Promise<GetObjectCommandOutput>
  async getFile(
    bucket: string,
    fileName: string,
  ): Promise<GetObjectCommandOutput>
  async getFile(
    bucket: string,
    fileName?: string,
  ): Promise<GetObjectCommandOutput> {
    // If bucket is the only parameter, then it must be an S3 bucket URI
    if (!fileName) {
      // `bucket` is actually an S3 bucket URI here
      const uri = AmazonS3Uri(bucket)
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
    fileName: string,
    encoding?: Encoding,
  ): Promise<string | undefined>
  async getFileEncoded(
    bucket: string,
    fileName: string,
    encoding?: Encoding,
  ): Promise<string | undefined>
  async getFileEncoded(
    bucket: string,
    fileName?: string,
    encoding: Encoding = 'base64',
  ): Promise<string | undefined> {
    const out = fileName
      ? await this.getFile(bucket, fileName)
      : await this.getFile(bucket)
    return out.Body?.transformToString(encoding)
  }

  async getFileB64(fileName: string): Promise<string>
  async getFileB64(bucket: string, fileName: string): Promise<string>
  async getFileB64(
    bucket: string,
    fileName?: string,
  ): Promise<string | undefined> {
    if (!fileName) return await this.getFileEncoded(bucket, 'base64')
    return await this.getFileEncoded(bucket, fileName, 'base64')
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
