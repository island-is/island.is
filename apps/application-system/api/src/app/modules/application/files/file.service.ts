import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import * as AWS from 'aws-sdk'
import { PdfTypes } from '@island.is/application/core'
import { Application } from './../application.model'
import { FormValue } from '@island.is/application/core'
import {
  ParentResidenceChange,
  PersonResidenceChange,
} from '@island.is/application/templates/children-residence-change'
import { User } from '@island.is/api/domains/national-registry'
import { environment } from '../../../../environments'
import {
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { KeyMapping, Signature } from './utils/types'

@Injectable()
export class FileService {
  s3: AWS.S3
  private one_minute = 60

  private bucketTypePrefix: KeyMapping<PdfTypes, string> = {
    ChildrenResidenceChange: 'children-residence-change',
  }

  constructor(
    @Inject(SigningService)
    private readonly signingService: SigningService,
  ) {
    this.s3 = new AWS.S3()
  }

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
        } = this.variablesForResidenceChange(answers, externalData)
        return await this.createResidenceChangePdf(
          parentA,
          parentB,
          childrenAppliedFor,
          expiry,
          application.id,
        )
      }
    }
  }

  async uploadSignedFile(
    application: Application,
    documentToken: string,
    type: PdfTypes,
  ) {
    const answers = application.answers as FormValue
    const externalData = application.externalData as FormValue

    const { ssn } = this.applicantData(answers, externalData)

    await this.signingService
      .getSignedDocument(`${'ssn'}.pdf`, documentToken)
      .then((file) => {
        let bucket =
          environment.fsS3Bucket ?? 'development-legal-residence-change'
        let s3FileName = `${this.bucketTypePrefix[type]}/${application.id}/${Signature.partiallySigned}.pdf`
        this.uploadFileToS3(Buffer.from(file, 'binary'), bucket, s3FileName)
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
        const { phoneNumber, name, ssn } = this.applicantData(
          answers,
          externalData,
        )
        let bucket = environment.fsS3Bucket ?? ''
        let s3FileName = `${this.bucketTypePrefix[type]}/${application.id}/${Signature.unsigned}.pdf`
        const s3File = await this.getFile(bucket, s3FileName)
        const fileContent = s3File.Body?.toString('binary')

        if (!fileContent || !phoneNumber) {
          throw new NotFoundException(
            `Variables for document signing not found`,
          )
        }

        return await this.signingService.requestSignature(
          phoneNumber,
          'Lögheimilisbreyting barns',
          name,
          'Ísland',
          `${ssn}.pdf`,
          fileContent,
        )
      }
    }
  }

  variablesForResidenceChange(answers: FormValue, externalData: FormValue) {
    const parentBNationalRegistry = externalData.parentNationalRegistry as FormValue
    const childrenAppliedFor = (answers.selectChild as unknown) as Array<
      PersonResidenceChange
    >
    const parentB = (parentBNationalRegistry.data as unknown) as ParentResidenceChange

    parentB.email = answers.parentBEmail as string
    parentB.phoneNumber = answers.parentBPhoneNumber as string

    const parentA = this.applicantData(answers, externalData)

    const expiry = answers.expiry as string

    return { parentA, parentB, childrenAppliedFor, expiry }
  }

  private async createResidenceChangePdf(
    parentA: ParentResidenceChange,
    parentB: ParentResidenceChange,
    childrenAppliedFor: Array<PersonResidenceChange>,
    expiry: string,
    applicationId: string,
  ): Promise<string> {
    const pdfBuffer = await generateResidenceChangePdf(
      childrenAppliedFor,
      parentA,
      parentB,
      expiry,
    )

    const fileName = `${
      this.bucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]
    }/${applicationId}/${Signature.unsigned}.pdf`
    let bucket = environment.fsS3Bucket ?? ''

    await this.uploadFileToS3(pdfBuffer, bucket, fileName)

    return await this.getPresignedUrl(bucket, fileName)
  }

  private applicantData(
    answers: FormValue,
    externalData: FormValue,
  ): ParentResidenceChange {
    const nationalRegistry = externalData.nationalRegistry as FormValue
    const nationalRegistryData = (nationalRegistry.data as unknown) as User

    return {
      id: nationalRegistryData.nationalId,
      name: nationalRegistryData.fullName,
      ssn: nationalRegistryData.nationalId,
      phoneNumber: answers.phoneNumber as string,
      email: answers.email as string,
      address: nationalRegistryData.address?.streetAddress as string,
      postalCode: nationalRegistryData.address?.postalCode as string,
      city: nationalRegistryData.address?.city as string,
    }
  }

  private async getFile(
    bucket: string,
    fileName: string,
  ): Promise<AWS.S3.GetObjectOutput> {
    const downloadParams = {
      Bucket: bucket,
      Key: fileName,
    }
    return await new Promise((resolve, reject) => {
      this.s3.getObject(downloadParams, (err, res) => {
        err ? reject(err) : resolve(res)
      })
    })
  }

  private async uploadFileToS3(
    content: Buffer,
    bucket: string,
    fileName: string,
  ): Promise<void> {
    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      ContentEncoding: 'base64',
      ContentDisposition: 'inline',
      ContentType: 'application/pdf',
      Body: content,
    }

    await this.s3
      .upload(uploadParams)
      .promise()
      .catch(() => {
        return null
      })
  }

  private async getPresignedUrl(
    bucket: string,
    fileName: string,
  ): Promise<string> {
    const presignedUrlParams = {
      Bucket: bucket,
      Key: fileName,
      Expires: this.one_minute * 120, // TODO: Select length for presigned url's in island.is
    }

    return await new Promise((resolve, reject) => {
      this.s3.getSignedUrl('getObject', presignedUrlParams, (err, url) => {
        err ? reject(err) : resolve(url)
      })
    })
  }
}
