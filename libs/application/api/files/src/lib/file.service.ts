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
import { AwsService } from '@island.is/nest/aws'
import { getOtherParentInformation } from '@island.is/application/templates/family-matters-core/utils'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { generateResidenceChangePdf } from './pdfGenerators'
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
    private readonly awsService: AwsService,
  ) {}

  async generatePdf(application: Application, pdfType: PdfTypes) {
    this.validateApplicationType(application.typeId)

    const fileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`
    const bucket = this.getBucketName()

    if ((await this.awsService.fileExists(bucket, fileName)) === false) {
      const content = await this.createFile(application, pdfType)
      await this.awsService.uploadFile(content, bucket, fileName, {
        ContentEncoding: 'base64',
        ContentDisposition: 'inline',
        ContentType: 'application/pdf',
      })
    }

    return await this.awsService.getPresignedUrl(bucket, fileName)
  }

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
        await this.awsService.uploadFile(
          Buffer.from(file, 'binary'),
          bucket,
          s3FileName,
        )
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

  async requestFileSignature(application: Application, pdfType: PdfTypes) {
    this.validateApplicationType(application.typeId)

    const signingOptions = await this.getSigningOptionsForApplication(
      application,
      pdfType,
    )

    return await this.signingService.requestSignature(
      signingOptions.phoneNumber,
      signingOptions.title,
      signingOptions.name,
      'Ísland',
      DokobitFileName[pdfType],
      signingOptions.fileContent,
    )
  }

  async getPresignedUrl(application: Application, pdfType: PdfTypes) {
    this.validateApplicationType(application.typeId)

    const bucket = this.getBucketName()

    const fileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`

    return await this.awsService.getPresignedUrl(bucket, fileName)
  }

  private async createFile(application: Application, pdfType: PdfTypes) {
    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE_V2:
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        return await generateResidenceChangePdf(application as CRCApplication)
      }
    }
  }

  private async getSigningOptionsForApplication(
    application: Application,
    pdfType: PdfTypes,
  ) {
    const bucket = this.getBucketName()
    const s3FileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`
    const s3File = await this.awsService.getFile(bucket, s3FileName)
    const fileContent = s3File.Body?.toString('binary')

    const { phoneNumber, name, title } = this.getSigningOptionsFromApplication(
      application,
      pdfType,
    )

    if (!fileContent) {
      throw new NotFoundException(`File content for document signing not found`)
    }

    return {
      phoneNumber,
      title,
      name,
      fileContent,
    }
  }

  private getSigningOptionsFromApplication = (
    application: Application,
    pdfType: PdfTypes,
  ) => {
    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE_V2:
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const { answers, externalData, state } = application as CRCApplication
        const { nationalRegistry } = externalData
        const isParentA = state === 'draft'
        const applicant = nationalRegistry?.data
        const parentB = getOtherParentInformation(
          externalData.childrenCustodyInformation.data,
          answers.selectedChildren,
        )
        const { name, phoneNumber } = isParentA
          ? {
              name: applicant.fullName,
              phoneNumber: answers.parentA.phoneNumber,
            }
          : {
              name: parentB.fullName,
              phoneNumber: answers.parentB.phoneNumber,
            }

        return {
          phoneNumber,
          title: 'Lögheimilisbreyting barns',
          name,
        }
      }
    }
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
    const url = await this.awsService.getPresignedUrl(bucket, key)
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
          await this.awsService.deleteObject(bucket, s3key)
          result = {
            ...result,
            deleted: result.deleted++,
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
