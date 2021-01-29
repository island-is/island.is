import { Injectable } from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import * as AWS from 'aws-sdk'
import { uuid } from 'uuidv4'
import { PDF_TYPES } from '@island.is/application/api-template-utils'
import { Application } from './application.model'
import { FormValue } from '@island.is/application/core'
import {
  ParentResidenceChange,
  PersonResidenceChange,
} from '@island.is/application/templates/children-residence-change'

@Injectable()
export class FileService {
  s3: AWS.S3
  private one_minute = 60

  constructor() {
    this.s3 = new AWS.S3()
  }

  async createPdf(application: Application, type: PDF_TYPES): Promise<string> {
    const answers = application.answers as FormValue
    const externalData = application.externalData as FormValue

    switch (type) {
      case PDF_TYPES.CHILDREN_RESIDENCE_CHANGE: {
        return await this.createResidenceChangePdf(answers, externalData)
      }
    }
  }

  private async createResidenceChangePdf(
    answers: FormValue,
    externalData: FormValue,
  ): Promise<string> {
    const parentBNationalRegistry = externalData.parentNationalRegistry as FormValue
    const childrenAppliedFor = (answers.selectChild as unknown) as Array<
      PersonResidenceChange
    >
    const parentB = (parentBNationalRegistry.data as unknown) as ParentResidenceChange

    parentB.email = answers.parentBEmail as string
    parentB.phoneNumber = answers.parentBPhoneNumber as string

    // TODO: Revisit once connection with national registry is up and we have actual schema for this data.
    const parentA: ParentResidenceChange = {
      id: answers.ssn as string,
      name: answers.name as string,
      ssn: answers.ssn as string,
      phoneNumber: answers.phoneNumber as string,
      email: answers.email as string,
      address: answers.address as string,
      postalCode: answers.postalCode as string,
      city: answers.city as string,
    }

    const expiry = answers.expiry as string

    const pdfBuffer = await generateResidenceChangePdf(
      childrenAppliedFor,
      parentA,
      parentB,
      expiry,
    )

    const id = uuid()
    const fileName = `${parentA.ssn}/${id}.pdf`
    const bucket = `${process.env.NODE_ENV}-legal-residence-change`

    return await this.getPresignedUrl(pdfBuffer, bucket, fileName)
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
