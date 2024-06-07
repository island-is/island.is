import { S3 } from 'aws-sdk'

import { Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import {
  CaseState,
  CaseType,
  isCompletedCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { awsS3ModuleConfig } from './awsS3.config'

const requestPrefix = 'uploads/'
const generatedPrefix = 'generated/'
const indictmentPrefix = 'indictments/'
const completedIndictmentPrefix = 'indictments/completed/'

const formatConfirmedKey = (key: string) =>
  key.replace(/\/([^/]*)$/, '/confirmed/$1')
const formatS3RequestKey = (key: string) => `${requestPrefix}${key}`
const formatS3IndictmentKey = (key: string) => `${indictmentPrefix}${key}`
const formatS3CompletedIndictmentKey = (key: string) =>
  `${completedIndictmentPrefix}${key}`
const formatS3Key = (caseType: CaseType, caseState: CaseState, key: string) =>
  isIndictmentCase(caseType)
    ? isCompletedCase(caseState)
      ? formatS3CompletedIndictmentKey(key)
      : formatS3IndictmentKey(key)
    : formatS3RequestKey(key)

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
    caseState: CaseState,
    key: string,
    type: string,
  ): Promise<S3.PresignedPost> {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(
        {
          Bucket: this.config.bucket,
          Expires: this.config.timeToLivePost,
          Fields: {
            key: formatS3Key(caseType, caseState, key),
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

  private objectExistsInS3(key: string): Promise<boolean> {
    return this.s3
      .headObject({
        Bucket: this.config.bucket,
        Key: key,
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

  private requestObjectExists(key: string): Promise<boolean> {
    return this.objectExistsInS3(formatS3RequestKey(key))
  }

  private async indictmentObjectExists(
    caseSate: CaseState,
    key: string,
  ): Promise<boolean> {
    if (isCompletedCase(caseSate)) {
      if (await this.objectExistsInS3(formatS3CompletedIndictmentKey(key))) {
        return true
      }
    }

    return this.objectExistsInS3(formatS3IndictmentKey(key))
  }

  objectExists(
    caseType: CaseType,
    caseState: CaseState,
    key: string,
  ): Promise<boolean> {
    return isIndictmentCase(caseType)
      ? this.indictmentObjectExists(caseState, key)
      : this.requestObjectExists(key)
  }

  private getSignedUrlFromS3(
    key: string,
    timeToLive?: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl(
        'getObject',
        {
          Bucket: this.config.bucket,
          Key: key,
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

  private getRequestSignedUrl(
    key: string,
    timeToLive?: number,
  ): Promise<string> {
    return this.getSignedUrlFromS3(formatS3RequestKey(key), timeToLive)
  }

  private async getIndictmentSignedUrl(
    caseSate: CaseState,
    key: string,
    timeToLive?: number,
  ): Promise<string> {
    if (isCompletedCase(caseSate)) {
      const completedKey = formatS3CompletedIndictmentKey(key)

      if (await this.objectExistsInS3(completedKey)) {
        return await this.getSignedUrlFromS3(completedKey, timeToLive)
      }
    }

    return this.getSignedUrlFromS3(formatS3IndictmentKey(key), timeToLive)
  }

  getSignedUrl(
    caseType: CaseType,
    caseState: CaseState,
    key?: string,
    timeToLive?: number,
  ): Promise<string> {
    if (!key) {
      throw new Error('Key is required')
    }

    return isIndictmentCase(caseType)
      ? this.getIndictmentSignedUrl(caseState, key, timeToLive)
      : this.getRequestSignedUrl(key, timeToLive)
  }

  async getConfirmedSignedUrl(
    caseType: CaseType,
    caseState: CaseState,
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

    const confirmedKey = formatConfirmedKey(key)

    // if (
    //   !force &&
    //   (await this.indictmentObjectExists(caseState, confirmedKey))
    // ) {
    //   return this.getIndictmentSignedUrl(caseState, confirmedKey, timeToLive)
    // }

    const confirmedContent = await this.getIndictmentObject(
      caseState,
      key,
    ).then((content) => confirmContent(content))

    if (!confirmedContent) {
      return this.getIndictmentSignedUrl(caseState, key, timeToLive)
    }

    return this.putConfirmedObject(
      caseType,
      caseState,
      key,
      confirmedContent,
    ).then(() =>
      this.getIndictmentSignedUrl(caseState, confirmedKey, timeToLive),
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

  private getRequestObject(key: string): Promise<Buffer> {
    return this.getObjectFromS3(formatS3RequestKey(key))
  }

  private async getIndictmentObject(
    caseSate: CaseState,
    key: string,
  ): Promise<Buffer> {
    if (isCompletedCase(caseSate)) {
      const completedKey = formatS3CompletedIndictmentKey(key)

      if (await this.objectExistsInS3(completedKey)) {
        return await this.getObjectFromS3(completedKey)
      }
    }

    return this.getObjectFromS3(formatS3IndictmentKey(key))
  }

  async getObject(
    caseType: CaseType,
    caseState: CaseState,
    key?: string,
  ): Promise<Buffer> {
    if (!key) {
      throw new Error('Key is required')
    }

    return isIndictmentCase(caseType)
      ? this.getIndictmentObject(caseState, key)
      : this.getRequestObject(key)
  }

  getGeneratedObject(caseType: CaseType, key: string): Promise<Buffer> {
    if (isIndictmentCase(caseType)) {
      throw new Error('Only request case objects can be generated')
    }

    return this.getObjectFromS3(`${generatedPrefix}${key}`)
  }

  async getConfirmedObject(
    caseType: CaseType,
    caseState: CaseState,
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

    const confirmedKey = formatConfirmedKey(key)

    if (
      !force &&
      (await this.indictmentObjectExists(caseState, confirmedKey))
    ) {
      return this.getIndictmentObject(caseState, confirmedKey)
    }

    const content = await this.getIndictmentObject(caseState, key)

    const confirmedContent = await confirmContent(content)

    if (!confirmedContent) {
      return this.getIndictmentObject(caseState, key)
    }

    return this.putConfirmedObject(
      caseType,
      caseState,
      key,
      confirmedContent,
    ).then(() => this.getIndictmentObject(caseState, confirmedKey))
  }

  private async putObjectToS3(key: string, content: string): Promise<string> {
    return this.s3
      .putObject({
        Bucket: this.config.bucket,
        Key: key,
        Body: Buffer.from(content, 'binary'),
        ContentType: 'application/pdf',
      })
      .promise()
      .then(() => key)
  }

  async putObject(
    caseType: CaseType,
    caseState: CaseState,
    key: string,
    content: string,
  ): Promise<string> {
    return this.putObjectToS3(formatS3Key(caseType, caseState, key), content)
  }

  putGeneratedObject(
    caseType: CaseType,
    key: string,
    content: string,
  ): Promise<string> {
    if (isIndictmentCase(caseType)) {
      throw new Error('Only request case objects can be generated')
    }

    return this.putObjectToS3(`${generatedPrefix}${key}`, content)
  }

  putConfirmedObject(
    caseType: CaseType,
    caseState: CaseState,
    key: string,
    content: string,
  ): Promise<string> {
    if (!isIndictmentCase(caseType)) {
      throw new Error('Only indictment case objects can be confirmed')
    }

    return this.putObject(caseType, caseState, formatConfirmedKey(key), content)
  }

  private async deleteObjectFromS3(key: string): Promise<boolean> {
    return this.s3
      .deleteObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise()
      .then(() => true)
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(`Failed to delete object ${key} from AWS S3`, {
          reason,
        })
        return false
      })
  }

  private deleteRequestObject(key: string): Promise<boolean> {
    return this.deleteObjectFromS3(formatS3RequestKey(key))
  }

  private async deleteIndictmentObject(
    caseSate: CaseState,
    key: string,
  ): Promise<boolean> {
    if (isCompletedCase(caseSate)) {
      const completedKey = formatS3CompletedIndictmentKey(key)

      if (await this.objectExistsInS3(completedKey)) {
        // No need to wait for the delete to finish
        this.deleteObjectFromS3(formatConfirmedKey(completedKey))

        return await this.deleteObjectFromS3(completedKey)
      }
    }

    const originalKey = formatS3IndictmentKey(key)

    // No need to wait for the delete to finish
    this.deleteObjectFromS3(formatConfirmedKey(originalKey))

    return this.deleteObjectFromS3(originalKey)
  }

  async deleteObject(
    caseType: CaseType,
    caseState: CaseState,
    key: string,
  ): Promise<boolean> {
    return isIndictmentCase(caseType)
      ? this.deleteIndictmentObject(caseState, key)
      : this.deleteRequestObject(key)
  }

  private async copyObject(key: string, newKey: string): Promise<string> {
    return this.s3
      .copyObject({
        Bucket: this.config.bucket,
        Key: newKey,
        CopySource: encodeURIComponent(`${this.config.bucket}/${key}`),
      })
      .promise()
      .then(() => newKey)
  }

  async archiveObject(
    caseType: CaseType,
    caseState: CaseState,
    key: string,
  ): Promise<string> {
    if (!isIndictmentCase(caseType)) {
      throw new Error('Only indictment case objects can be archived')
    }

    if (!isCompletedCase(caseState)) {
      throw new Error('Only completed indictment case objects can be archived')
    }

    const oldKey = formatS3IndictmentKey(key)
    const newKey = formatS3CompletedIndictmentKey(key)

    const oldConfirmedKey = formatConfirmedKey(oldKey)

    if (await this.objectExistsInS3(oldConfirmedKey)) {
      const newConfirmedKey = formatConfirmedKey(newKey)

      if (!(await this.objectExistsInS3(newConfirmedKey))) {
        await this.copyObject(oldConfirmedKey, newConfirmedKey)
      }

      // No need to wait for the delete to finish
      this.deleteObjectFromS3(oldConfirmedKey)
    }

    if (!(await this.objectExistsInS3(newKey))) {
      await this.copyObject(oldKey, newKey)
    }

    // No need to wait for the delete to finish
    this.deleteObjectFromS3(oldKey)

    return newKey
  }
}
