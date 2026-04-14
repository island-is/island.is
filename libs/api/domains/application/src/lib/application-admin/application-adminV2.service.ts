import { ApplicationsApi, ApplicationTypeAdmin } from '../../../gen/fetch'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { isUUID } from 'class-validator'
import { Locale } from '@island.is/shared/types'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { AdminApi as FormSystemAdminApi } from '@island.is/clients/form-system'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationsAdminFilters,
  ApplicationsAdminStatisticsInput,
  ApplicationsSuperAdminFilters,
  ApplicationTypesAdminInput,
} from '../application-admin/dto/applications-admin-inputs'
import {
  applicationAdminSortByModified,
  deduplicateInstitutions,
  mapFormSystemApplicationAdmin,
  mapFormSystemApplicationTypeAdmin,
  mapFormSystemInstitutionAdmin,
  mapFormSystemStatisticsAdmin,
} from '../utils'
import {
  ApplicationAdminPaginatedResponse,
  ApplicationAdmin,
  ApplicationInstitution,
  ApplicationStatistics,
} from '../application.model'

@Injectable()
export class ApplicationAdminV2Service {
  constructor(
    private readonly appSystemApplicationApi: ApplicationsApi,
    private readonly formSystemAdminApi: FormSystemAdminApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  appSystemApplicationApiWithAuth(auth: Auth) {
    return this.appSystemApplicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  formSystemAdminApiWithAuth(auth: User) {
    return this.formSystemAdminApi.withMiddleware(new AuthMiddleware(auth))
  }

  async findAllApplicationsForSuperAdmin(
    user: User,
    locale: Locale,
    filters: ApplicationsSuperAdminFilters,
  ): Promise<ApplicationAdminPaginatedResponse> {
    // If the user is filtering by a typeId from the opposite system we should skip the call to the other system
    const skipAppSystem = !!filters.typeIdValue && isUUID(filters.typeIdValue)
    const skipFormSystem = !!filters.typeIdValue && !isUUID(filters.typeIdValue)
    // Fetch enough items from each source to cover the requested page
    const fetchCount = filters.page * filters.count

    const appSystemPromise = skipAppSystem
      ? null
      : this.appSystemApplicationApiWithAuth(user).adminControllerFindAllSuperAdmin({
          count: fetchCount,
          page: 1,
          applicantNationalId: filters.applicantNationalId,
          locale,
          status: filters.status?.join(','),
          from: filters.from,
          to: filters.to,
          typeIdValue: filters.typeIdValue,
          searchStr: filters.searchStr,
          institutionNationalId: filters.institutionNationalId,
        })

    const formSystemPromise = skipFormSystem
      ? null
      : this.formSystemAdminApiWithAuth(user).adminControllerGetOverviewForSuperAdmin({
            count: fetchCount,
            page: 1,
            applicantNationalId: filters.applicantNationalId,
            locale,
            from: filters.from,
            to: filters.to,
            formId: filters.typeIdValue,
            searchStr: filters.searchStr,
            institutionNationalId: filters.institutionNationalId,
          })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise ?? Promise.resolve(null),
      formSystemPromise ?? Promise.resolve(null),
    ])

    let appSystemRows: ApplicationAdmin[] = []
    let formSystemRows: ApplicationAdmin[] = []
    let totalCount = 0
    if (appSystemSettled.status === 'fulfilled' && appSystemSettled.value) {
      appSystemRows = appSystemSettled.value.rows
      totalCount += appSystemSettled.value.count
    } else if (appSystemSettled.status === 'rejected') {
      this.logger.error(
        'Error getting application system applications for super-admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled' && formSystemSettled.value) {
      formSystemRows = (formSystemSettled.value.rows ?? []).map(
        mapFormSystemApplicationAdmin,
      )
      totalCount += formSystemSettled.value.count
    } else if (formSystemSettled.status === 'rejected') {
      this.logger.error(
        'Error getting form system applications for super-admin',
        formSystemSettled.reason,
      )
    }

    // Merge, sort, and slice to correct page offset
    const offset = (filters.page - 1) * filters.count
    const mergedRows = [...appSystemRows, ...formSystemRows]
      .sort(applicationAdminSortByModified)
      .slice(offset, offset + filters.count)

    return {
      rows: mergedRows,
      count: totalCount,
    }
  }

  async findAllApplicationsForInstitutionAdmin(
    user: User,
    locale: Locale,
    filters: ApplicationsAdminFilters,
  ): Promise<ApplicationAdminPaginatedResponse> {
    // If the user is filtering by a typeId from the opposite system we should skip the call to the other system
    const skipAppSystem = !!filters.typeIdValue && isUUID(filters.typeIdValue)
    const skipFormSystem = !!filters.typeIdValue && !isUUID(filters.typeIdValue)
    // Fetch enough items from each source to cover the requested page
    const fetchCount = filters.page * filters.count

    const appSystemPromise = skipAppSystem
      ? null
      : this.appSystemApplicationApiWithAuth(user).adminControllerFindAllInstitutionAdmin({
          count: fetchCount,
          page: 1,
          applicantNationalId: filters.applicantNationalId,
          locale,
          status: filters.status?.join(','),
          from: filters.from,
          to: filters.to,
          typeIdValue: filters.typeIdValue,
          searchStr: filters.searchStr,
        })

    const formSystemPromise = skipFormSystem
      ? null
      : this.formSystemAdminApiWithAuth(user).adminControllerGetOverviewForInstitutionAdmin({
            count: fetchCount,
            page: 1,
            applicantNationalId: filters.applicantNationalId,
            locale,
            from: filters.from,
            to: filters.to,
            formId: filters.typeIdValue,
            searchStr: filters.searchStr,
          })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise ?? Promise.resolve(null),
      formSystemPromise ?? Promise.resolve(null),
    ])

    let appSystemRows: ApplicationAdmin[] = []
    let formSystemRows: ApplicationAdmin[] = []
    let totalCount = 0
    if (appSystemSettled.status === 'fulfilled' && appSystemSettled.value) {
      appSystemRows = appSystemSettled.value.rows
      totalCount += appSystemSettled.value.count
    } else if (appSystemSettled.status === 'rejected') {
      this.logger.error(
        'Error getting application system applications for institution admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled' && formSystemSettled.value) {
      formSystemRows = (formSystemSettled.value.rows ?? []).map(
        mapFormSystemApplicationAdmin,
      )
      totalCount += formSystemSettled.value.count
    } else if (formSystemSettled.status === 'rejected') {
      this.logger.error(
        'Error getting form system applications for institution admin',
        formSystemSettled.reason,
      )
    }

    // Merge, sort, and slice to correct page offset
    const offset = (filters.page - 1) * filters.count
    const mergedRows = [...appSystemRows, ...formSystemRows]
      .sort(applicationAdminSortByModified)
      .slice(offset, offset + filters.count)

    return {
      rows: mergedRows,
      count: totalCount,
    }
  }

  async findAllApplicationTypesForSuperAdmin(
    user: User,
    locale: Locale,
    input: ApplicationTypesAdminInput,
  ): Promise<ApplicationTypeAdmin[]> {
    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesSuperAdmin({
      nationalId: input.nationalId,
      locale,
    })

    const formSystemPromise = this.formSystemAdminApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesForSuperAdmin({
      nationalId: input.nationalId,
      locale,
    })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemTypes: ApplicationTypeAdmin[] = []
    let formSystemTypes: ApplicationTypeAdmin[] = []
    if (appSystemSettled.status === 'fulfilled') {
      appSystemTypes = appSystemSettled.value
    } else {
      this.logger.error(
        'Error getting application system application types for super-admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled') {
      formSystemTypes = formSystemSettled.value.map(
        mapFormSystemApplicationTypeAdmin,
      )
    } else {
      this.logger.error(
        'Error getting form system application types for super-admin',
        formSystemSettled.reason,
      )
    }

    return [...appSystemTypes, ...formSystemTypes]
  }

  async findAllApplicationTypesForInstitutionAdmin(
    user: User,
    locale: Locale,
  ): Promise<ApplicationTypeAdmin[]> {
    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesInstitutionAdmin({
      locale,
    })

    const formSystemPromise = this.formSystemAdminApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesForInstitutionAdmin({
      locale,
    })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemTypes: ApplicationTypeAdmin[] = []
    let formSystemTypes: ApplicationTypeAdmin[] = []
    if (appSystemSettled.status === 'fulfilled') {
      appSystemTypes = appSystemSettled.value
    } else {
      this.logger.error(
        'Error getting application system application types for institution admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled') {
      formSystemTypes = formSystemSettled.value.map(
        mapFormSystemApplicationTypeAdmin,
      )
    } else {
      this.logger.error(
        'Error getting form system application types for institution admin',
        formSystemSettled.reason,
      )
    }

    return [...appSystemTypes, ...formSystemTypes]
  }

  async findAllInstitutionsForSuperAdmin(
    user: User,
  ): Promise<ApplicationInstitution[]> {
    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerGetInstitutionsSuperAdmin({})

    const formSystemPromise = this.formSystemAdminApiWithAuth(
      user,
    ).adminControllerGetInstitutions({})

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemInstitutions: ApplicationInstitution[] = []
    let formSystemInstitutions: ApplicationInstitution[] = []
    if (appSystemSettled.status === 'fulfilled') {
      appSystemInstitutions = appSystemSettled.value
    } else {
      this.logger.error(
        'Error getting application system institutions for super-admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled') {
      formSystemInstitutions = formSystemSettled.value.map(
        mapFormSystemInstitutionAdmin,
      )
    } else {
      this.logger.error(
        'Error getting form system institutions for super-admin',
        formSystemSettled.reason,
      )
    }

    return deduplicateInstitutions([
      ...appSystemInstitutions,
      ...formSystemInstitutions,
    ])
  }

  async getApplicationStatisticsForSuperAdmin(
    user: User,
    locale: Locale,
    input: ApplicationsAdminStatisticsInput,
  ): Promise<ApplicationStatistics[]> {
    const appSystemPromise =
      this.appSystemApplicationApiWithAuth(
        user,
      ).adminControllerGetSuperAdminCountByTypeIdAndStatus(input)

    const formSystemPromise = this.formSystemAdminApiWithAuth(
      user,
    ).adminControllerGetStatisticsForSuperAdmin({
      startDate: input.startDate,
      endDate: input.endDate,
      locale,
    })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemStatistics: ApplicationStatistics[] = []
    let formSystemStatistics: ApplicationStatistics[] = []
    if (appSystemSettled.status === 'fulfilled') {
      appSystemStatistics = appSystemSettled.value
    } else {
      this.logger.error(
        'Error getting application system statistics for super-admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled') {
      formSystemStatistics = formSystemSettled.value.map(
        mapFormSystemStatisticsAdmin,
      )
    } else {
      this.logger.error(
        'Error getting form system statistics for super-admin',
        formSystemSettled.reason,
      )
    }

    return [...appSystemStatistics, ...formSystemStatistics]
  }

  async getApplicationStatisticsForInstitutionAdmin(
    user: User,
    locale: Locale,
    input: ApplicationsAdminStatisticsInput,
  ): Promise<ApplicationStatistics[]> {
    const appSystemPromise =
      this.appSystemApplicationApiWithAuth(
        user,
      ).adminControllerGetInstitutionCountByTypeIdAndStatus(input)

    const formSystemPromise = this.formSystemAdminApiWithAuth(
      user,
    ).adminControllerGetStatisticsForInstitutionAdmin({
      startDate: input.startDate,
      endDate: input.endDate,
      locale,
    })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemStatistics: ApplicationStatistics[] = []
    let formSystemStatistics: ApplicationStatistics[] = []
    if (appSystemSettled.status === 'fulfilled') {
      appSystemStatistics = appSystemSettled.value
    } else {
      this.logger.error(
        'Error getting application system statistics for institution admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled') {
      formSystemStatistics = formSystemSettled.value.map(
        mapFormSystemStatisticsAdmin,
      )
    } else {
      this.logger.error(
        'Error getting form system statistics for institution admin',
        formSystemSettled.reason,
      )
    }

    return [...appSystemStatistics, ...formSystemStatistics]
  }
}
