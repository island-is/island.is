import { S3 } from 'aws-sdk'

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
  private readonly s3: S3

  constructor(
    @Inject(awsS3ModuleConfig.KEY)
    private readonly config: ConfigType<typeof awsS3ModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.s3 = new S3({ region: this.config.region })
  }

  createPresignedPost(
    caseType: CaseType,
    key: string,
    type: string,
  ): Promise<S3.PresignedPost> {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(
        {
          Bucket: this.config.bucket,
          Expires: this.config.timeToLivePost,
          Fields: {
            key: formatS3Key(caseType, key),
            'content-type': type,
            'Content-Disposition': 'inline',
          },
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        },
      )
    })
  }

  objectExists(caseType: CaseType, key: string): Promise<boolean> {
    return this.s3
      .headObject({
        Bucket: this.config.bucket,
        Key: formatS3Key(caseType, key),
      })
      .promise()
      .then(
        () => true,
        () => {
          // The error is either 404 Not Found or 403 Forbidden.
          // Normally, we would check if the error is 404 Not Found.
          // However, to avoid granting the service ListBucket permissions,
          // we also allow 403 Forbidden.
          return false
        },
      )
  }

  private async putObjectToS3(
    key: string,
    content: string | Buffer,
    contentType?: string,
  ): Promise<string> {
    const Body =
      typeof content === 'string' ? Buffer.from(content, 'binary') : content
    return this.s3
      .putObject({
        Bucket: this.config.bucket,
        Key: key,
        Body,
        ContentType: contentType ?? 'application/pdf',
      })
      .promise()
      .then(() => key)
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
    return new Promise((resolve, reject) => {
      const s3 = useFreshSession
        ? new S3({ region: this.config.region })
        : this.s3

      s3.getSignedUrl(
        'getObject',
        {
          Bucket: this.config.bucket,
          Key: formatS3Key(type, key),
          Expires: timeToLive ?? this.config.timeToLiveGet,
        },
        (err, url) => {
          if (err) {
            reject(err)
          } else {
            resolve(url)
          }
        },
      )
    })
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

    const confirmedContent = await this.getObject(caseType, key).then(
      (content) => confirmContent(content),
    )

    if (!confirmedContent) {
      return this.getSignedUrl(caseType, key, timeToLive, useFreshSession)
    }

    return this.putObject(caseType, confirmedKey, confirmedContent).then(() =>
      this.getSignedUrl(caseType, confirmedKey, timeToLive, useFreshSession),
    )
  }

  private async getObjectFromS3(key: string): Promise<Buffer> {
    return this.s3
      .getObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise()
      .then((data) => data.Body as Buffer)
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

    return this.putObject(caseType, confirmedKey, confirmedContent).then(() =>
      this.getObject(caseType, confirmedContent),
    )
  }

  async deleteObject(caseType: CaseType, key: string): Promise<boolean> {
    const s3Key = formatS3Key(caseType, key)

    return this.s3
      .deleteObject({
        Bucket: this.config.bucket,
        Key: s3Key,
      })
      .promise()
      .then(() => true)
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(`Failed to delete object ${s3Key} from AWS S3`, {
          reason,
        })

        return false
      })
  }
}
