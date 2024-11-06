import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  RequestTimeoutException,
  InternalServerErrorException,
} from '@nestjs/common'
import { PdfTypes } from '@island.is/application/types'
import { Application } from '@island.is/application/api/core'
import { SigningService } from '@island.is/dokobit-signing'
import {
  BucketTypePrefix,
  DokobitFileName,
  DokobitErrorCodes,
} from './utils/constants'
import { S3Service } from '@island.is/nest/aws'
import AmazonS3URI from 'amazon-s3-uri'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApplicationFilesConfig } from './files.config'
import { ConfigType } from '@nestjs/config'

export interface AttachmentMetaData {
  s3key: string
  key: string
  bucket: string
  value: string
}

export interface AttachmentDeleteResult {
  failed: { [key: string]: string }
  success: boolean
  deleted: number
}

@Injectable()
export class FileService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(ApplicationFilesConfig.KEY)
    private config: ConfigType<typeof ApplicationFilesConfig>,
    private readonly signingService: SigningService,
    private readonly s3Service: S3Service,
  ) {}

  async uploadSignedFile(
    application: Application,
    documentToken: string,
    pdfType: PdfTypes,
  ) {
    this.validateApplicationType(application.typeId)

    const bucket = this.getBucketName()

    await this.signingService
      .waitForSignature(DokobitFileName[pdfType], documentToken)
      .then(async (file) => {
        const s3FileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`
        await this.s3Service.uploadFile(Buffer.from(file, 'binary'), {
          bucket,
          key: s3FileName,
        })
      })
      .catch((error) => {
        if (error.code === DokobitErrorCodes.NoMobileSignature) {
          throw new NotFoundException(error.message)
        }

        if (error.code === DokobitErrorCodes.UserCancelled) {
          throw new BadRequestException(error.message)
        }

        if (
          error.code === DokobitErrorCodes.TimeOut ||
          error.code === DokobitErrorCodes.SessionExpired
        ) {
          throw new RequestTimeoutException(error.message)
        }

        throw new InternalServerErrorException(error.message)
      })
  }

  async getPresignedUrl(application: Application, pdfType: PdfTypes) {
    this.validateApplicationType(application.typeId)

    const bucket = this.getBucketName()

    const fileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`

    return await this.s3Service.getPresignedUrl({ bucket, key: fileName })
  }

  private validateApplicationType(applicationType: string) {
    if (
      Object.values(PdfTypes).includes(applicationType as PdfTypes) === false
    ) {
      throw new BadRequestException(
        'Application type is not supported in file service.',
      )
    }
  }

  private getBucketName() {
    const bucket = this.config.presignBucket

    if (!bucket) {
      throw new Error('Bucket name not found.')
    }

    return bucket
  }

  async getAttachmentPresignedURL(fileName: string) {
    const { bucket, key } = AmazonS3URI(fileName)
    const url = await this.s3Service.getPresignedUrl({ bucket, key })
    return { url }
  }

  async deleteAttachmentsForApplication(
    application: Pick<Application, 'id' | 'attachments'>,
  ): Promise<AttachmentDeleteResult> {
    let result: AttachmentDeleteResult = {
      failed: {},
      success: true,
      deleted: 0,
    }

    const applicationAttachments = application.attachments as {
      key: string
      name: string
    }

    const attachments = this.attachmentsToMetaDataArray(applicationAttachments)

    if (attachments) {
      for (const attachment of attachments) {
        const { key, s3key, bucket, value } = attachment

        try {
          this.logger.info(`Deleting attachment ${s3key} from bucket ${bucket}`)
          await this.s3Service.deleteObject({ bucket, key: s3key })
          result = {
            ...result,
            deleted: (result.deleted += 1),
          }
        } catch (error) {
          this.logger.error(
            `S3 object delete failed for application Id: ${application.id} and attachment key: ${key}`,
            error,
          )

          result = {
            ...result,
            failed: {
              ...result.failed,
              [key]: value,
            },
            success: false,
          }
        }
      }
    }
    return result
  }

  private attachmentsToMetaDataArray(
    attachments: object,
  ): AttachmentMetaData[] {
    const keys: AttachmentMetaData[] = []
    for (const [key, value] of Object.entries(attachments)) {
      const { key: sourceKey, bucket } = AmazonS3URI(value)
      keys.push({ key, s3key: sourceKey, bucket, value })
    }

    return keys
  }
}
