import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'

import { ApplicationsApi, PaymentsApi } from '../../gen/fetch'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { AssignApplicationInput } from './dto/assignApplication.input'
import { GeneratePdfInput } from './dto/generatePdf.input'
import { RequestFileSignatureInput } from './dto/requestFileSignature.input'
import { UploadSignedFileInput } from './dto/uploadSignedFile.input'
import { ApplicationApplicationsInput } from './dto/applicationApplications.input'
import { GetPresignedUrlInput } from './dto/getPresignedUrl.input'
import { ApplicationPayment } from './application.model'

@Injectable()
export class ApplicationService {
  constructor(
    private _applicationApi: ApplicationsApi,
    private _applicationPaymentApi: PaymentsApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this._applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  paymentApiWithAuth(auth: Auth) {
    return this._applicationPaymentApi.withMiddleware(new AuthMiddleware(auth))
  }

  async findOne(id: string, auth: Auth, locale: Locale) {
    return await this.applicationApiWithAuth(auth).applicationControllerFindOne(
      {
        id,
        locale,
      },
    )
  }

  async getPaymentStatus(
    applicationId: string,
    auth: Auth,
    locale: Locale,
  ): Promise<ApplicationPayment> {
    return await this.paymentApiWithAuth(
      auth,
    ).paymentControllerGetPaymentStatus({
      applicationId,
      locale,
    })
  }

  async createCharge(
    applicationId: string,
    auth: Auth,
    chargeItemCode: string,
  ) {
    return this.paymentApiWithAuth(auth).paymentControllerCreateCharge({
      applicationId: applicationId,
      body: { chargeItemCode: chargeItemCode },
      authorization: auth.authorization,
    })
  }

  async findAll(
    user: User,
    locale: Locale,
    input?: ApplicationApplicationsInput,
  ) {
    return await this.applicationApiWithAuth(user).applicationControllerFindAll(
      {
        nationalId: user.nationalId,
        locale,
        typeId: input?.typeId?.join(','),
        status: input?.status?.join(','),
      },
    )
  }

  async create(input: CreateApplicationInput, auth: Auth) {
    return this.applicationApiWithAuth(auth).applicationControllerCreate({
      createApplicationDto: input,
    })
  }

  async update(input: UpdateApplicationInput, auth: Auth, locale: Locale) {
    const { id, ...updateApplicationDto } = input

    return await this.applicationApiWithAuth(auth).applicationControllerUpdate({
      id,
      updateApplicationDto,
      locale,
    })
  }

  async addAttachment(input: AddAttachmentInput, auth: Auth) {
    const { id, ...addAttachmentDto } = input

    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerAddAttachment({
      id,
      addAttachmentDto,
    })
  }

  async deleteAttachment(input: DeleteAttachmentInput, auth: Auth) {
    const { id, ...deleteAttachmentDto } = input

    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerDeleteAttachment({
      id,
      deleteAttachmentDto,
    })
  }

  async updateExternalData(
    input: UpdateApplicationExternalDataInput,
    auth: Auth,
    locale: Locale,
  ) {
    const { id, ...populateExternalDataDto } = input

    return this.applicationApiWithAuth(
      auth,
    ).applicationControllerUpdateExternalData({
      id,
      populateExternalDataDto,
      locale,
    })
  }

  async submitApplication(input: SubmitApplicationInput, auth: Auth) {
    const { id, ...updateApplicationStateDto } = input
    return this.applicationApiWithAuth(
      auth,
    ).applicationControllerSubmitApplication({
      id,
      updateApplicationStateDto,
    })
  }

  async assignApplication(input: AssignApplicationInput, auth: Auth) {
    return this.applicationApiWithAuth(
      auth,
    ).applicationControllerAssignApplication({
      assignApplicationDto: input,
    })
  }

  async generatePdfPresignedUrl(input: GeneratePdfInput, auth: Auth) {
    const { id, ...generatePdfDto } = input
    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerGeneratePdf({
      id,
      generatePdfDto,
    })
  }

  async requestFileSignature(input: RequestFileSignatureInput, auth: Auth) {
    const { id, ...requestFileSignatureDto } = input
    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerRequestFileSignature({
      id,
      requestFileSignatureDto,
    })
  }

  async uploadSignedFile(input: UploadSignedFileInput, auth: Auth) {
    const { id, ...uploadSignedFileDto } = input
    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerUploadSignedFile({
      id,
      uploadSignedFileDto,
    })
  }

  async presignedUrl(input: GetPresignedUrlInput, auth: Auth) {
    const { id, type } = input

    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerGetPresignedUrl({
      id,
      pdfType: type,
    })
  }
}
