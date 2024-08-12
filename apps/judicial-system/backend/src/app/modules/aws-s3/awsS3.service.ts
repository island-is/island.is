import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import {
  CaseType,
  isIndictmentCase,
  isRequestCase,
} from '@island.is/judicial-system/types'

import { awsS3ModuleConfig } from './awsS3.config'

const requestPrefix = 'uploads/'
const generatedRequestPrefix = 'generated/'
const indictmentPrefix = 'indictments/'

const formatGeneratedRequestCaseKey = (key: string) =>
  `${generatedRequestPrefix}${key}`
const formatConfirmedIndictmentCaseKey = (key: string) =>
  key.replace(/\/([^/]*)$/, '/confirmed/$1')
const formatS3RequestCaseKey = (key: string) => `${requestPrefix}${key}`
const formatS3IndictmentCaseKey = (key: string) => `${indictmentPrefix}${key}`
const formatS3Key = (caseType: CaseType, key: string) => {
  if (isRequestCase(caseType)) {
    return formatS3RequestCaseKey(key)
  }

  if (isIndictmentCase(caseType)) {
    return formatS3IndictmentCaseKey(key)
  }

  throw new Error('Unknown case type')
}

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client

  constructor(
    @Inject(awsS3ModuleConfig.KEY)
    private readonly config: ConfigType<typeof awsS3ModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.s3Client = new S3Client({ region: this.config.region })
  }

  async createPresignedPost(
    caseType: CaseType,
    key: string,
    type: string,
  ): Promise<{ url: string; fields: Record<string, string> }> {
    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: this.config.bucket,
      Key: formatS3Key(caseType, key),
      Conditions: [
        ['content-length-range', 0, 104857600], // 100 MB
        ['starts-with', '$Content-Type', type],
      ],
      Fields: {
        'content-type': type,
        'Content-Disposition': 'inline',
      },
      Expires: this.config.timeToLivePost,
    })

    return { url, fields }
  }

  async objectExists(caseType: CaseType, key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: formatS3Key(caseType, key),
        }),
      )
      return true
    } catch (error) {
      // The error is either 404 Not Found or 403 Forbidden.
      // Normally, we would check if the error is 404 Not Found.
      // However, to avoid granting the service ListBucket permissions,
      // we also allow 403 Forbidden.
      return false
    }
  }

  private async putObjectToS3(key: string, content: string): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: Buffer.from(content, 'binary'),
        ContentType: 'application/pdf',
      }),
    )
    return key
  }

  putObject(caseType: CaseType, key: string, content: string): Promise<string> {
    return this.putObjectToS3(formatS3Key(caseType, key), content)
  }

  putGeneratedRequestCaseObject(
    caseType: CaseType,
    key: string,
    content: string,
  ): Promise<string> {
    if (!isRequestCase(caseType)) {
      throw new Error('Only request case objects can be generated')
    }

    return this.putObjectToS3(formatGeneratedRequestCaseKey(key), content)
  }

  async getSignedUrl(
    caseType: CaseType,
    key?: string,
    timeToLive?: number,
  ): Promise<string> {
    if (!key) {
      throw new Error('Key is required')
    }

    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: formatS3Key(caseType, key),
    })

    return getSignedUrl(this.s3Client, command, {
      expiresIn: timeToLive ?? this.config.timeToLiveGet,
    })
  }

  async getConfirmedIndictmentCaseSignedUrl(
    caseType: CaseType,
    key: string | undefined,
    force: boolean,
    confirmContent: (content: Buffer) => Promise<string | undefined>,
    timeToLive?: number,
  ): Promise<string> {
    if (!key) {
      throw new Error('Key is required')
    }

    if (!isIndictmentCase(caseType)) {
      throw new Error('Only indictment case objects can be confirmed')
    }

    const confirmedKey = formatConfirmedIndictmentCaseKey(key)

    if (!force && (await this.objectExists(caseType, confirmedKey))) {
      return this.getSignedUrl(caseType, confirmedKey, timeToLive)
    }

    const confirmedContent = await this.getObject(caseType, key).then(
      (content) => confirmContent(content),
    )

    if (!confirmedContent) {
      return this.getSignedUrl(caseType, key, timeToLive)
    }

    return this.putObject(caseType, confirmedKey, confirmedContent).then(() =>
      this.getSignedUrl(caseType, confirmedKey, timeToLive),
    )
  }

  private async getObjectFromS3(key: string): Promise<Buffer> {
    const { Body } = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    )
    if (!Body) {
      this.logger.error(`Failure when getting object from S3`, { key })
      throw new Error('Failure when getting object from S3')
    }
    return Buffer.from(await Body.transformToByteArray())
  }

  async getObject(caseType: CaseType, key?: string): Promise<Buffer> {
    if (!key) {
      throw new Error('Key is required')
    }

    return this.getObjectFromS3(formatS3Key(caseType, key))
  }

  getGeneratedRequestCaseObject(
    caseType: CaseType,
    key: string,
  ): Promise<Buffer> {
    if (!isRequestCase(caseType)) {
      throw new Error('Only request case objects can be generated')
    }

    return this.getObjectFromS3(formatGeneratedRequestCaseKey(key))
  }

  async getConfirmedIndictmentCaseObject(
    caseType: CaseType,
    key: string | undefined,
    force: boolean,
    confirmContent: (content: Buffer) => Promise<string | undefined>,
  ): Promise<Buffer> {
    if (!key) {
      throw new Error('Key is required')
    }

    if (!isIndictmentCase(caseType)) {
      throw new Error('Only indictment case objects can be confirmed')
    }

    const confirmedKey = formatConfirmedIndictmentCaseKey(key)

    if (!force && (await this.objectExists(caseType, confirmedKey))) {
      return this.getObject(caseType, confirmedKey)
    }

    const content = await this.getObject(caseType, key)

    const confirmedContent = await confirmContent(content)

    if (!confirmedContent) {
      return content
    }

    return this.putObject(caseType, confirmedKey, confirmedContent).then(() =>
      this.getObject(caseType, confirmedContent),
    )
  }

  async deleteObject(caseType: CaseType, key: string): Promise<boolean> {
    const s3Key = formatS3Key(caseType, key)

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.config.bucket,
          Key: s3Key,
        }),
      )
      return true
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(`Failed to delete object ${s3Key} from AWS S3`, {
        reason: error,
      })
      return false
    }
  }

  deleteConfirmedIndictmentCaseObject(
    caseType: CaseType,
    key: string,
  ): Promise<boolean> {
    if (!isIndictmentCase(caseType)) {
      throw new Error('Only indictment case objects can be confirmed')
    }

    // No need to wait for the delete to finish
    this.deleteObject(caseType, formatConfirmedIndictmentCaseKey(key))

    return this.deleteObject(caseType, key)
  }
}
