import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post'
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
const formatS3StatisticsKey = (key: string) => `csv/${key}`
const formatS3RequestCaseKey = (key: string) => `${requestPrefix}${key}`
const formatS3IndictmentCaseKey = (key: string) => `${indictmentPrefix}${key}`
const formatS3Key = (caseType: CaseType | 'statistics', key: string) => {
  if (caseType === 'statistics') {
    return formatS3StatisticsKey(key)
  }

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
  private readonly s3: S3Client

  constructor(
    @Inject(awsS3ModuleConfig.KEY)
    private readonly config: ConfigType<typeof awsS3ModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.s3 = new S3Client({ region: this.config.region })
  }

  createPresignedPost(
    caseType: CaseType,
    key: string,
    type: string,
  ): Promise<PresignedPost> {
    return createPresignedPost(this.s3, {
      Bucket: this.config.bucket,
      Key: formatS3Key(caseType, key),
      Expires: this.config.timeToLivePost,
      Fields: {
        'content-type': type,
        'Content-Disposition': 'inline',
      },
    })
  }

  async objectExists(caseType: CaseType, key: string): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: formatS3Key(caseType, key),
        }),
      )

      return true
    } catch {
      // The error is either 404 Not Found or 403 Forbidden.
      // Normally, we would check if the error is 404 Not Found.
      // However, to avoid granting the service ListBucket permissions,
      // we also allow 403 Forbidden.
      return false
    }
  }

  private async putObjectToS3(
    key: string,
    content: string | Buffer,
    contentType?: string,
  ): Promise<string> {
    const Body =
      typeof content === 'string' ? Buffer.from(content, 'binary') : content

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body,
        ContentType: contentType ?? 'application/pdf',
      }),
    )

    return key
  }

  putObject(
    caseType: CaseType,
    key: string,
    content: string | Buffer,
  ): Promise<string> {
    return this.putObjectToS3(formatS3Key(caseType, key), content)
  }

  uploadCsvToS3(key: string, content: string | Buffer): Promise<string> {
    return this.putObjectToS3(`csv/${key}`, content, 'text/csv')
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

  getSignedUrl(
    type: CaseType | 'statistics',
    key: string,
    timeToLive?: number,
    useFreshSession = false,
  ): Promise<string> {
    const s3 = useFreshSession
      ? new S3Client({ region: this.config.region })
      : this.s3

    return getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: formatS3Key(type, key),
      }),
      { expiresIn: timeToLive ?? this.config.timeToLiveGet },
    )
  }

  async getConfirmedIndictmentCaseSignedUrl(
    caseType: CaseType,
    key: string,
    force: boolean,
    confirmContent: (content: Buffer) => Promise<string | undefined>,
    timeToLive?: number,
    useFreshSession = false,
  ): Promise<string> {
    if (!isIndictmentCase(caseType)) {
      throw new Error('Only indictment case objects can be confirmed')
    }

    const confirmedKey = formatConfirmedIndictmentCaseKey(key)

    if (!force && (await this.objectExists(caseType, confirmedKey))) {
      return this.getSignedUrl(
        caseType,
        confirmedKey,
        timeToLive,
        useFreshSession,
      )
    }

    const content = await this.getObject(caseType, key)
    const confirmedContent = await confirmContent(content)

    if (!confirmedContent) {
      return this.getSignedUrl(caseType, key, timeToLive, useFreshSession)
    }

    await this.putObject(caseType, confirmedKey, confirmedContent)

    return this.getSignedUrl(
      caseType,
      confirmedKey,
      timeToLive,
      useFreshSession,
    )
  }

  private async getObjectFromS3(key: string): Promise<Buffer> {
    const { Body } = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    )

    if (!Body) {
      throw new Error(`No body found for object ${key} in AWS S3`)
    }

    return Buffer.from(await Body.transformToByteArray())
  }

  async getObject(caseType: CaseType, key: string): Promise<Buffer> {
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
    key: string,
    force: boolean,
    confirmContent: (content: Buffer) => Promise<string | undefined>,
  ): Promise<Buffer> {
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

    await this.putObject(caseType, confirmedKey, confirmedContent)

    return this.getObject(caseType, confirmedKey)
  }

  async copyObject(
    caseType: CaseType,
    sourceKey: string,
    destKey: string,
  ): Promise<void> {
    const src = formatS3Key(caseType, sourceKey)
    const dst = formatS3Key(caseType, destKey)

    // Unlike the `Key` parameter (which the SDK URL-encodes automatically),
    // `CopySource` must be URL-encoded by the caller. Encode each path segment
    // but keep the slashes so keys containing spaces or non-ASCII characters
    // (e.g. Icelandic ó, ð, þ) resolve to the correct source object instead of
    // failing with SignatureDoesNotMatch.
    const copySource = `${this.config.bucket}/${src}`
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/')

    await this.s3.send(
      new CopyObjectCommand({
        Bucket: this.config.bucket,
        CopySource: copySource,
        Key: dst,
      }),
    )
  }

  async deleteObject(caseType: CaseType, key: string): Promise<boolean> {
    const s3Key = formatS3Key(caseType, key)

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.config.bucket,
          Key: s3Key,
        }),
      )

      return true
    } catch (reason) {
      // Tolerate failure, but log error
      this.logger.error(`Failed to delete object ${s3Key} from AWS S3`, {
        reason,
      })

      return false
    }
  }
}
