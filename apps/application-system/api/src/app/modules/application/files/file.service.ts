import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import { PdfTypes } from '@island.is/application/core'
import { Application } from './../application.model'
import { FormValue } from '@island.is/application/core'
import {
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { Signature } from './utils/types'
import { BucketTypePrefix, DokobitFileName } from './utils/constants'
import {
  applicantData,
  variablesForResidenceChange,
} from './utils/childrenResidenceChange'
import { getFile, getPresignedUrl, uploadFile } from './utils/aws'

@Injectable()
export class FileService {
  constructor(
    @Inject(SigningService)
    private readonly signingService: SigningService,
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

        const pdfBuffer = await generateResidenceChangePdf(
          childrenAppliedFor,
          parentA,
          parentB,
          expiry,
        )

        const fileName = `${
          BucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]
        }/${application.id}/${Signature.Unsigned}.pdf`

        await uploadFile(pdfBuffer, fileName)

        return await getPresignedUrl(fileName)
      }
    }
  }

  async uploadSignedFile(
    application: Application,
    documentToken: string,
    type: PdfTypes,
  ) {
    await this.signingService
      .getSignedDocument(DokobitFileName[type], documentToken)
      .then((file) => {
        const s3FileName = `${BucketTypePrefix[type]}/${application.id}/${Signature.PartiallySigned}.pdf`
        uploadFile(Buffer.from(file, 'binary'), s3FileName)
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
  ) {
    const s3FileName = `${BucketTypePrefix[type]}/${applicationId}/${Signature.Unsigned}.pdf`
    const s3File = await getFile(s3FileName)
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
}
