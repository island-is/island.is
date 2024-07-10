import { Inject, Injectable } from '@nestjs/common'
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { v4 as uuid } from 'uuid'
import AmazonS3URI from 'amazon-s3-uri'
import kebabCase from 'lodash/kebabCase'
import { ConfigType } from '@nestjs/config'
import { FileStorageConfig } from './file-storage.configuration'

const PRESIGNED_POST_EXPIRES = 1000 * 60 * 5
const SIGNED_GET_EXPIRES = 10 * 60

@Injectable()
export class FileStorageService {
  private s3Client: S3Client

  constructor(
    @Inject(FileStorageConfig.KEY)
    private config: ConfigType<typeof FileStorageConfig>,
  ) {
    this.s3Client = new S3Client({ apiVersion: '2006-03-01' })
  }

  async generatePresignedPost(
    filename: string,
  ): Promise<{ url: string; fields: Record<string, string> }> {
    if (!this.config.uploadBucket) {
      throw new Error('Upload bucket not configured.')
    }

    if (!filename) {
      throw new Error('Missing filename.')
    }

    // To make sure we dont format the file extension when its present. If its not present return the filename
    const splitFileName = filename.split('.')
    const fName =
      splitFileName.length >= 2
        ? splitFileName.slice(0, -1).join('.')
        : filename
    const fExt = splitFileName.length >= 2 ? `.${splitFileName.pop()}` : ''
    const fileId = uuid()
    const key = `${fileId}_${kebabCase(fName)}${fExt}`

    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: this.config.uploadBucket,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10000000], // Max 10MB
      ],
      Expires: PRESIGNED_POST_EXPIRES / 1000, // createPresignedPost expects seconds
    })

    return { url, fields }
  }

  public async generateSignedUrl(url: string): Promise<string> {
    const { bucket, key } = AmazonS3URI(url)
    const command = new GetObjectCommand({ Bucket: bucket, Key: key })

    return getSignedUrl(this.s3Client, command, {
      expiresIn: SIGNED_GET_EXPIRES,
    })
  }

  public getObjectUrl(key: string): string {
    return `s3://${this.config.uploadBucket}/${key}`
  }

  async copyObjectFromUploadBucket(
    sourceKey: string,
    destinationBucket: string,
    destinationKey: string,
  ): Promise<string> {
    if (!this.config.uploadBucket) {
      throw new Error('Upload bucket not configured.')
    }

    const command = new CopyObjectCommand({
      Key: destinationKey,
      Bucket: destinationBucket,
      CopySource: `${this.config.uploadBucket}/${sourceKey}`,
    })

    await this.s3Client.send(command)

    const region = await this.s3Client.config.region()
    return `https://${destinationBucket}.s3-${region}.amazonaws.com/${destinationKey}`
  }
}
