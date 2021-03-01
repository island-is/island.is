import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import { PdfTypes } from '@island.is/application/core'
import { Application } from './../application.model'
import { FormValue } from '@island.is/application/core'
import {
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { BucketTypePrefix, DokobitFileName } from './utils/constants'
import {
  applicantData,
  variablesForResidenceChange,
} from './utils/childrenResidenceChange'
import { AwsService } from './aws.service'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from '../application.configuration'

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
    type: PdfTypes,
  ): Promise<string | undefined> {
    const answers = application.answers as FormValue
    const externalData = application.externalData as FormValue

    switch (type) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const {
          parentA,
          parentB,
          childrenAppliedFor,
          expiry,
        } = variablesForResidenceChange(answers, externalData)
        const bucket = this.getBucketName()

        const pdfBuffer = await generateResidenceChangePdf(
          childrenAppliedFor,
          parentA,
          parentB,
          expiry,
        )

        const fileName = `${
          BucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]
        }/${application.id}.pdf`

        await this.awsService.uploadFile(pdfBuffer, bucket, fileName)

        return this.awsService.getPresignedUrl(bucket, fileName)
      }
    }
  }

  async uploadSignedFile(
    application: Application,
    documentToken: string,
    type: PdfTypes,
  ) {
    const bucket = this.getBucketName()

    await this.signingService
      .getSignedDocument(DokobitFileName[type], documentToken)
      .then((file) => {
        const s3FileName = `${BucketTypePrefix[type]}/${application.id}.pdf`
        this.awsService.uploadFile(
          Buffer.from(file, 'binary'),
          bucket,
          s3FileName,
        )
      })
  }

  async requestFileSignature(
    application: Application,
    type: PdfTypes,
  ): Promise<SigningServiceResponse> {
    const answers = application.answers as FormValue
    const externalData = application.externalData as FormValue

    switch (type) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const { phoneNumber, name } = applicantData(answers, externalData)
        return await this.handleChildrenResidenceChangeSignature(
          type,
          application.id,
          name,
          phoneNumber,
        )
      }
    }
  }

  private async handleChildrenResidenceChangeSignature(
    type: PdfTypes,
    applicationId: string,
    applicantName: string,
    phoneNumber?: string,
  ): Promise<SigningServiceResponse> {
    const bucket = this.getBucketName()

    const s3FileName = `${BucketTypePrefix[type]}/${applicationId}.pdf`
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
      DokobitFileName[type],
      fileContent,
    )
  }

  validateApplicationType(applicationType: string) {
    if (
      Object.values(PdfTypes).includes(applicationType as PdfTypes) === false
    ) {
      throw new BadRequestException(
        'Application type is not supported in file service.',
      )
    }
  }

  validateFileSignature(
    applicationType: string,
    type: PdfTypes,
    attachments?: object,
  ) {
    this.validateApplicationType(applicationType)

    const data = attachments as { [type]: string }
    if (data?.[type] === undefined) {
      throw new BadRequestException(
        'Document has not been uploaded to be signed',
      )
    }
  }

  validateFileUpload(
    applicationType: string,
    documentToken: string,
    externalData: object,
  ) {
    this.validateApplicationType(applicationType)

    const data = externalData as {
      fileSignature: { data: { documentToken: string } }
    }
    if (data?.fileSignature?.data?.documentToken !== documentToken) {
      throw new BadRequestException(
        'Document token does not match token on application',
      )
    }
  }

  getPresignedUrl(applicationId: string, type: PdfTypes) {
    const bucket = this.getBucketName()

    const fileName = `${
      BucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]
    }/${applicationId}.pdf`

    return this.awsService.getPresignedUrl(bucket, fileName)
  }

  private getBucketName() {
    const bucket = this.config.presignBucket

    if (!bucket) {
      throw new Error('Bucket name not found.')
    }

    return bucket
  }
}
