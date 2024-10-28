import { PresignedPost } from '@aws-sdk/s3-presigned-post'

import { Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
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
  constructor(
    @Inject(awsS3ModuleConfig.KEY)
    private readonly config: ConfigType<typeof awsS3ModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly s3Service: S3Service,
  ) {}

  createPresignedPost(
    caseType: CaseType,
    key: string,
    type: string,
  ): Promise<PresignedPost> {
    const formattedKey = formatS3Key(caseType, key)
    return this.s3Service.createPresignedPost({
      Bucket: this.config.bucket,
      Key: formattedKey,
      Expires: this.config.timeToLivePost,
      Fields: {
        key: formattedKey,
        'content-type': type,
        'Content-Disposition': 'inline',
      },
    })
  }

  objectExists(caseType: CaseType, key: string): Promise<boolean> {
    return this.s3Service.fileExists({
      bucket: this.config.bucket,
      key: formatS3Key(caseType, key),
    })
  }

  private async putObjectToS3(key: string, content: string): Promise<string> {
    return this.s3Service.putObject(
      {
        bucket: this.config.bucket,
        key,
      },
      Buffer.from(content, 'binary'),
      'application/pdf',
    )
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

  getSignedUrl(
    caseType: CaseType,
    key?: string,
    timeToLive?: number,
  ): Promise<string> {
    if (!key) {
      throw new Error('Key is required')
    }

    return this.s3Service.getPresignedUrl(
      {
        bucket: this.config.bucket,
        key: formatS3Key(caseType, key),
      },
      timeToLive ?? this.config.timeToLiveGet,
    )
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
    const content = await this.s3Service.getFileContent(
      {
        bucket: this.config.bucket,
        key: key,
      },
      'binary',
    )

    if (!content)
      throw new Error(
        `No content from file: ${key} in S3 bucket: ${this.config.bucket}`,
      )

    return Buffer.from(content, 'binary')
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

    return this.s3Service.deleteObject({
      bucket: this.config.bucket,
      key: s3Key,
    })
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
