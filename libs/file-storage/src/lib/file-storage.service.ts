import { Inject, Injectable } from '@nestjs/common'
import { S3Service } from '@island.is/nest/aws'
import { uuid } from 'uuidv4'
import kebabCase from 'lodash/kebabCase'
import { ConfigType } from '@nestjs/config'
import { FileStorageConfig } from './file-storage.configuration'
import { PresignedPost } from '@aws-sdk/s3-presigned-post'
import { Tag } from '@aws-sdk/client-s3'

const PRESIGNED_POST_EXPIRES = 5 * 60
const SIGNED_GET_EXPIRES = 5 * 60

@Injectable()
export class FileStorageService {
  constructor(
    @Inject(FileStorageConfig.KEY)
    private config: ConfigType<typeof FileStorageConfig>,
    private readonly s3Service: S3Service,
  ) {}

  generatePresignedPost(filename: string): Promise<PresignedPost> {
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

    const params = {
      Bucket: this.config.uploadBucket,
      Key: key,
      Expires: PRESIGNED_POST_EXPIRES,
      Fields: {
        key,
      },
      conditions: [['content-length-range', 0, 10000000]], // Max 10MB
    }

    return this.s3Service.createPresignedPost(params)
  }

  public generateSignedUrl(url: string): Promise<string> {
    return this.s3Service.getPresignedUrl(url, SIGNED_GET_EXPIRES)
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
    const region = await this.s3Service.getClientRegion()

    await this.s3Service.copyObject(
      {
        bucket: destinationBucket,
        key: destinationKey,
      },
      `${this.config.uploadBucket}/${sourceKey}`,
    )
    return `https://${destinationBucket}.s3-${region}.amazonaws.com/${destinationKey}`
  }

  async fileExists(key: string): Promise<boolean> {
    if (!this.config.uploadBucket) {
      throw new Error('Upload bucket not configured.')
    }

    return this.s3Service.fileExists({
      bucket: this.config.uploadBucket,
      key,
    })
  }

  async getFileTags(filename: string): Promise<Tag[]> {
    if (!this.config.uploadBucket) {
      throw new Error('Upload bucket not configured.')
    }

    if (!filename) {
      throw new Error('Missing filename.')
    }

    return this.s3Service.getFileTags({
      bucket: this.config.uploadBucket,
      key: filename,
    })
  }
}
