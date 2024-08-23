import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'

@Injectable()
export class AwsService {
  s3: S3

  constructor() {
    this.s3 = new S3()
  }

  async getFile(
    bucket: string,
    fileName: string,
  ): Promise<AWS.S3.GetObjectOutput> {
    const downloadParams = {
      Bucket: bucket,
      Key: fileName,
    }

    return await this.s3.getObject(downloadParams).promise()
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
    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      Body: content,
      ...uploadParameters,
    }

    const { Location: url } = await this.s3.upload(uploadParams).promise()
    return url
  }

  async getPresignedUrl(bucket: string, fileName: string): Promise<string> {
    const oneMinute = 60
    const presignedUrlParams = {
      Bucket: bucket,
      Key: fileName,
      Expires: oneMinute * 120, // TODO: Select length for presigned url's in island.is
    }

    return await this.s3.getSignedUrlPromise('getObject', presignedUrlParams)
  }

  public async fileExists(bucket: string, fileName: string): Promise<boolean> {
    return await this.s3
      .headObject({ Bucket: bucket, Key: fileName })
      .promise()
      .then(
        () => true,
        () => false,
      )
  }

  public async deleteObject(bucket: string, key: string) {
    await this.s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise()
  }
}
