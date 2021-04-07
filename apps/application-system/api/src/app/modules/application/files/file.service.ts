import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  RequestTimeoutException,
  InternalServerErrorException,
} from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import { PdfTypes } from '@island.is/application/core'
import { Application } from './../application.model'
import {
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import {
  BucketTypePrefix,
  DokobitFileName,
  DokobitErrorCodes,
} from './utils/constants'
import { AwsService } from './aws.service'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from '../application.configuration'
import {
  CRCApplication,
  getSelectedChildrenFromExternalData,
} from '@island.is/application/templates/children-residence-change'

@Injectable()
export class FileService {
  constructor(
    @Inject(APPLICATION_CONFIG)
    private readonly config: ApplicationConfig,
    private readonly signingService: SigningService,
    private readonly awsService: AwsService,
  ) {}

  async createPdf(
    application: Application,
    pdfType: PdfTypes,
  ): Promise<string | undefined> {
    this.validateApplicationType(application.typeId)

    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        return await this.createChildrenResidencePdf(
          application as CRCApplication,
        )
      }
    }
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
      .then((file) => {
        const s3FileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`
        this.awsService.uploadFile(
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

  async requestFileSignature(
    application: Application,
    pdfType: PdfTypes,
  ): Promise<SigningServiceResponse> {
    this.validateApplicationType(application.typeId)
    const { answers, externalData, id, state } = application as CRCApplication
    const { nationalRegistry } = externalData
    const isParentA = state === 'draft'
    const applicant = nationalRegistry?.data
    const selectedChildren = getSelectedChildrenFromExternalData(
      applicant.children,
      answers.selectedChildren,
    )
    const parentB = selectedChildren[0].otherParent

    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const { fullName, phoneNumber } = isParentA
          ? {
              fullName: applicant.fullName,
              phoneNumber: answers.parentA.phoneNumber,
            }
          : {
              fullName: parentB.fullName,
              phoneNumber: answers.parentB.phoneNumber,
            }

        return await this.handleChildrenResidenceChangeSignature(
          pdfType,
          id,
          fullName,
          phoneNumber,
        )
      }
    }
  }

  async getPresignedUrl(application: Application, pdfType: PdfTypes) {
    this.validateApplicationType(application.typeId)

    const bucket = this.getBucketName()

    const fileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`

    return await this.awsService.getPresignedUrl(bucket, fileName)
  }

  private async createChildrenResidencePdf(application: CRCApplication) {
    const bucket = this.getBucketName()

    const pdfBuffer = await generateResidenceChangePdf(application)

    const fileName = `${BucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]}/${
      application.id
    }.pdf`

    await this.awsService.uploadFile(pdfBuffer, bucket, fileName)

    return await this.awsService.getPresignedUrl(bucket, fileName)
  }

  private async handleChildrenResidenceChangeSignature(
    pdfType: PdfTypes,
    applicationId: string,
    applicantName: string,
    phoneNumber?: string,
  ): Promise<SigningServiceResponse> {
    const bucket = this.getBucketName()

    const s3FileName = `${BucketTypePrefix[pdfType]}/${applicationId}.pdf`
    const s3File = await this.awsService.getFile(bucket, s3FileName)
    const fileContent = s3File.Body?.toString('binary')

    if (!fileContent || !phoneNumber) {
      throw new NotFoundException(`Variables for document signing not found`)
    }

    return await this.signingService.requestSignature(
      phoneNumber,
      'Lögheimilisbreyting barns',
      applicantName,
      'Ísland',
      DokobitFileName[pdfType],
      fileContent,
    )
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
}
