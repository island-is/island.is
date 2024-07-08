import { Injectable } from '@nestjs/common'
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectOutput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class AwsService {
  s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({})
  }

  async getFile(bucket: string, fileName: string): Promise<GetObjectOutput> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileName,
    })

    return await this.s3Client.send(command)
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

  async getPresignedUrl(bucket: string, fileName: string): Promise<string> {
    const MINUTE = 60
    const HOUR = 60 * MINUTE
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileName,
    })

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 2 * HOUR, // TODO: Select length for presigned url's in island.is
    })
  }

  public async fileExists(bucket: string, fileName: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: fileName,
    })

    try {
      await this.s3Client.send(command)
      return true
    } catch (error) {
      if (error.name === 'NotFound') {
        return false
      }
      throw error
    }
  }

  public async deleteObject(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    await this.s3Client.send(command)
  }
}
