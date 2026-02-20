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
  ApplicationsSuperAdminFilters,
  ApplicationsAdminStatisticsInput,
  ApplicationsAdminFilters,
  ApplicationTypesAdminInput,
} from './application-admin/dto/applications-admin-inputs'

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

  async findAllSuperAdmin(
    user: User,
    locale: Locale,
    filters: ApplicationsSuperAdminFilters,
  ) {
    return this.applicationApiWithAuth(user).adminControllerFindAllSuperAdmin({
      count: filters.count,
      page: filters.page,
      applicantNationalId: filters.applicantNationalId,
      locale,
      status: filters.status?.join(','),
      from: filters.from,
      to: filters.to,
      typeIdValue: filters.typeIdValue,
      searchStr: filters.searchStr,
      institutionNationalId: filters.institutionNationalId,
    })
  }

  async findAllInstitutionAdmin(
    user: User,
    locale: Locale,
    filters: ApplicationsAdminFilters,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerFindAllInstitutionAdmin({
      page: filters.page,
      count: filters.count,
      locale,
      status: filters.status?.join(','),
      applicantNationalId: filters.applicantNationalId,
      from: filters.from,
      to: filters.to,
      typeIdValue: filters.typeIdValue,
      searchStr: filters.searchStr,
    })
  }

  async findAllApplicationTypesInstitutionAdmin(user: User, locale: Locale) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesInstitutionAdmin({
      locale,
    })
  }

  async findAllApplicationTypesSuperAdmin(
    user: User,
    locale: Locale,
    input: ApplicationTypesAdminInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesSuperAdmin({
      locale,
      nationalId: input.nationalId,
    })
  }

  async create(input: CreateApplicationInput, auth: Auth) {
    return this.applicationApiWithAuth(auth).applicationControllerCreate({
      createApplicationDto: input,
    })
  }

  async getSuperAdminApplicationCountByTypeIdAndStatus(
    user: User,
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetSuperAdminCountByTypeIdAndStatus(input)
  }

  async getInstitutionApplicationCountByTypeIdAndStatus(
    user: User,
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetInstitutionCountByTypeIdAndStatus(input)
  }

  async getApplicationInstitutions(user: User) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetInstitutionsSuperAdmin({})
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

  async submitApplication(
    input: SubmitApplicationInput,
    auth: Auth,
    locale: Locale,
  ) {
    const { id, ...updateApplicationStateDto } = input
    return this.applicationApiWithAuth(
      auth,
    ).applicationControllerSubmitApplication({
      id,
      updateApplicationStateDto,
      locale,
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
