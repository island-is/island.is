import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  RequestTimeoutException,
  InternalServerErrorException,
} from '@nestjs/common'
import { PdfTypes } from '@island.is/application/core'
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
import type { ApplicationConfig } from '../application.configuration'
import { APPLICATION_CONFIG } from '../application.configuration'
import { generateResidenceChangePdf } from './pdfGenerators'
import AmazonS3URI from 'amazon-s3-uri'

@Injectable()
export class FileService {
  constructor(
    @Inject(APPLICATION_CONFIG)
    private readonly config: ApplicationConfig,
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
      .getSignedDocument(DokobitFileName[pdfType], documentToken)
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
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const { answers, externalData, state } = application as CRCApplication
        const { nationalRegistry } = externalData
        const isParentA = state === 'draft'
        const applicant = nationalRegistry?.data
        const parentB = getOtherParentInformation(
          applicant.children,
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
}
