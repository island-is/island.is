import { Injectable } from '@nestjs/common'
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
import { ApplicationApplicationsInput } from './dto/applicationApplications.input'
import { ApplicationPayment } from './application.model'
import { AttachmentPresignedUrlInput } from './dto/AttachmentPresignedUrl.input'
import { DeleteApplicationInput } from './dto/deleteApplication.input'
import {
  ApplicationApplicationsAdminInput,
  ApplicationApplicationsAdminStatisticsInput,
  ApplicationApplicationsInstitutionAdminInput,
  ApplicationTypesInstitutionAdminInput,
} from './application-admin/dto/applications-applications-admin-input'

@Injectable()
export class ApplicationService {
  constructor(
    private applicationApi: ApplicationsApi,
    private applicationPaymentApi: PaymentsApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  paymentApiWithAuth(auth: Auth) {
    return this.applicationPaymentApi.withMiddleware(new AuthMiddleware(auth))
  }

  async findOne(id: string, auth: Auth, locale: Locale) {
    const data = await this.applicationApiWithAuth(
      auth,
    ).applicationControllerFindOne({
      id,
      locale,
    })

    if (data.pruned) {
      return { ...data, answers: {}, attachments: {}, externalData: {} }
    }

    return data
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
        scopeCheck: input?.scopeCheck,
      },
    )
  }

  async findAllAdmin(
    user: User,
    locale: Locale,
    input: ApplicationApplicationsAdminInput,
  ) {
    return this.applicationApiWithAuth(user).adminControllerFindAllAdmin({
      nationalId: input.nationalId,
      locale,
      typeId: input.typeId?.join(','),
      status: input.status?.join(','),
    })
  }

  async findAllInstitutionAdmin(
    user: User,
    locale: Locale,
    input: ApplicationApplicationsInstitutionAdminInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerFindAllInstitutionAdmin({
      page: input.page,
      count: input.count,
      locale,
      status: input.status?.join(','),
      applicantNationalId: input.applicantNationalId,
      from: input.from,
      to: input.to,
      typeIdValue: input.typeIdValue,
      searchStrValue: input.searchStrValue,
    })
  }

  async findAllApplicationTypesInstitutionAdmin(
    user: User,
    locale: Locale,
    input: ApplicationTypesInstitutionAdminInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesInstitutionAdmin({
      nationalId: input.nationalId,
      locale,
    })
  }

  async create(input: CreateApplicationInput, auth: Auth) {
    return this.applicationApiWithAuth(auth).applicationControllerCreate({
      createApplicationDto: input,
    })
  }

  async getApplicationCountByTypeIdAndStatus(
    user: User,
    locale: Locale,
    input: ApplicationApplicationsAdminStatisticsInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetCountByTypeIdAndStatus(input)
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

  async deleteApplication(input: DeleteApplicationInput, auth: Auth) {
    return this.applicationApiWithAuth(auth).applicationControllerDelete({
      id: input.id,
    })
  }

  async attachmentPresignedURL(input: AttachmentPresignedUrlInput, auth: Auth) {
    const { id, attachmentKey } = input

    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerGetAttachmentPresignedURL({
      id,
      attachmentKey,
    })
  }
}
