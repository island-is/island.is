import { Injectable } from '@nestjs/common'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'
import { ApplicationsApi } from '../../../gen/fetch'
import {
  ApplicationsSuperAdminFilters,
  ApplicationsAdminStatisticsInput,
  ApplicationsAdminFilters,
  ApplicationTypesAdminInput,
} from '../application-admin/dto/applications-admin-inputs'

@Injectable()
/** @deprecated Use ApplicationV2Service which merges results from both application-system and form-system */
export class ApplicationAdminService {
  constructor(private applicationApi: ApplicationsApi) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async findAllApplicationsForSuperAdmin(
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

  async findAllApplicationsForInstitutionAdmin(
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

  async findAllApplicationTypesForInstitutionAdmin(user: User, locale: Locale) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesInstitutionAdmin({
      locale,
    })
  }

  async findAllApplicationTypesForSuperAdmin(
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

  async findAllInstitutionsForSuperAdmin(user: User) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetInstitutionsSuperAdmin({})
  }

  async getApplicationStatisticsForSuperAdmin(
    user: User,
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetSuperAdminCountByTypeIdAndStatus(input)
  }

  async getApplicationStatisticsForInstitutionAdmin(
    user: User,
    input: ApplicationsAdminStatisticsInput,
  ) {
    return this.applicationApiWithAuth(
      user,
    ).adminControllerGetInstitutionCountByTypeIdAndStatus(input)
  }
}
