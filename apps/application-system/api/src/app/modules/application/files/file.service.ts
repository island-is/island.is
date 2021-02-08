import { Inject, Injectable } from '@nestjs/common'
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
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'

@Injectable()
export class FileService {
  s3: AWS.S3
  private one_minute = 60
  private childrenResidenceChangeS3Prefix = 'children-residence-change'

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

  async requestFileSignature(
    application: Application,
    type: PdfTypes,
  ): Promise<SigningServiceResponse> {
    const answers = application.answers as FormValue
    const externalData = application.externalData as FormValue

    switch (type) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const {phoneNumber, name, ssn} = this.parentAData(answers, externalData)
        let bucket = environment.fsS3Bucket ?? ''
        let s3FileName = `${this.childrenResidenceChangeS3Prefix}/${ssn}/${application.id}.pdf`
        const s3File = await this.getFile(bucket, s3FileName) // TODO: Test this logic and add content to fileContent variable below
        const fileContent = 'blabla'
        console.log(s3File)

        return await this.signingService.requestSignature(
          phoneNumber as string,
          'Lögheimilisbreyting barns',
          name,
          'Ísland',
          `${ssn}.pdf`,
          fileContent
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

    const parentA = this.parentAData(answers, externalData)

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

    const fileName = `${this.childrenResidenceChangeS3Prefix}/${parentA.ssn}/${applicationId}.pdf`
    const bucket = environment.fsS3Bucket ?? ''

    return await this.getPresignedUrl(pdfBuffer, bucket, fileName)
  }

  private parentAData(answers: FormValue, externalData: FormValue): ParentResidenceChange {
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

  private async getFile(bucket: string, fileName: string): Promise<AWS.S3.GetObjectOutput> {
    const downloadParams = {
      Bucket: bucket,
      Key: fileName,
    }
    return await new Promise((resolve, reject) => {
      this.s3.getObject(downloadParams, (err, res) => {
        err? reject(err): resolve(res)
      })
    })
  }

  private async getPresignedUrl(
    buffer: Buffer,
    bucket: string,
    fileName: string,
  ): Promise<string> {
    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      ContentEncoding: 'base64',
      ContentDisposition: 'inline',
      ContentType: 'application/pdf',
      Body: buffer,
    }

    await this.s3
      .upload(uploadParams)
      .promise()
      .catch(() => {
        return null
      })

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
