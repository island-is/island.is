import { ApplicationsApi, ApplicationTypeAdmin } from '../../../gen/fetch'
import { Inject, Injectable, Logger } from '@nestjs/common'
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
  applicationAdminSortByCreated,
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
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

@Injectable()
export class ApplicationAdminV2Service {
  constructor(
    private readonly appSystemApplicationApi: ApplicationsApi,
    private readonly formSystemAdminApi: FormSystemAdminApi,
    private readonly featureFlagService: FeatureFlagService,
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
    const includeFormSystem = await this.featureFlagService.getValue(
      Features.isFormSystemInAdminPortalEnabled,
      true,
      user,
    )

    // Fetch enough items from each source to cover the requested page
    const fetchCount = filters.page * filters.count

    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerFindAllSuperAdmin({
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

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(
          user,
        ).adminControllerGetOverviewForSuperAdmin({
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
      : Promise.resolve({ rows: [], count: 0 })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemRows: ApplicationAdmin[] = []
    let formSystemRows: ApplicationAdmin[] = []
    let totalCount = 0
    if (appSystemSettled.status === 'fulfilled') {
      appSystemRows = appSystemSettled.value.rows
      totalCount += appSystemSettled.value.count
    } else {
      this.logger.error(
        'Error getting application system applications for super-admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled') {
      formSystemRows = (formSystemSettled.value.rows ?? []).map(
        mapFormSystemApplicationAdmin,
      )
      totalCount += formSystemSettled.value.count
    } else {
      this.logger.error(
        'Error getting form system applications for super-admin',
        formSystemSettled.reason,
      )
    }

    // Merge, sort, and slice to correct page offset
    const offset = (filters.page - 1) * filters.count
    const mergedRows = [...appSystemRows, ...formSystemRows]
      .sort(applicationAdminSortByCreated)
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
    const includeFormSystem = await this.featureFlagService.getValue(
      Features.isFormSystemInAdminPortalEnabled,
      true,
      user,
    )

    // Fetch enough items from each source to cover the requested page
    const fetchCount = filters.page * filters.count

    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerFindAllInstitutionAdmin({
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

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(
          user,
        ).adminControllerGetOverviewForInstitutionAdmin({
          count: fetchCount,
          page: 1,
          applicantNationalId: filters.applicantNationalId,
          locale,
          from: filters.from,
          to: filters.to,
          formId: filters.typeIdValue,
          searchStr: filters.searchStr,
        })
      : Promise.resolve({ rows: [], count: 0 })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemRows: ApplicationAdmin[] = []
    let formSystemRows: ApplicationAdmin[] = []
    let totalCount = 0
    if (appSystemSettled.status === 'fulfilled') {
      appSystemRows = appSystemSettled.value.rows
      totalCount += appSystemSettled.value.count
    } else {
      this.logger.error(
        'Error getting application system applications for institution admin',
        appSystemSettled.reason,
      )
    }
    if (formSystemSettled.status === 'fulfilled') {
      formSystemRows = (formSystemSettled.value.rows ?? []).map(
        mapFormSystemApplicationAdmin,
      )
      totalCount += formSystemSettled.value.count
    } else {
      this.logger.error(
        'Error getting form system applications for institution admin',
        formSystemSettled.reason,
      )
    }

    // Merge, sort, and slice to correct page offset
    const offset = (filters.page - 1) * filters.count
    const mergedRows = [...appSystemRows, ...formSystemRows]
      .sort(applicationAdminSortByCreated)
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
    const includeFormSystem = await this.featureFlagService.getValue(
      Features.isFormSystemInAdminPortalEnabled,
      true,
      user,
    )

    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesSuperAdmin({
      nationalId: input.nationalId,
      locale,
    })

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(
          user,
        ).adminControllerGetApplicationTypesForSuperAdmin({
          nationalId: input.nationalId,
          locale,
        })
      : Promise.resolve([])

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
    const includeFormSystem = await this.featureFlagService.getValue(
      Features.isFormSystemInAdminPortalEnabled,
      true,
      user,
    )

    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerGetApplicationTypesInstitutionAdmin({
      locale,
    })

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(
          user,
        ).adminControllerGetApplicationTypesForInstitutionAdmin({
          locale,
        })
      : Promise.resolve([])

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
    const includeFormSystem = await this.featureFlagService.getValue(
      Features.isFormSystemInAdminPortalEnabled,
      true,
      user,
    )

    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerGetInstitutionsSuperAdmin({})

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(user).adminControllerGetInstitutions({})
      : Promise.resolve([])

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

    return [...appSystemInstitutions, ...formSystemInstitutions]
  }

  async getApplicationStatisticsForSuperAdmin(
    user: User,
    locale: Locale,
    input: ApplicationsAdminStatisticsInput,
  ): Promise<ApplicationStatistics[]> {
    const includeFormSystem = await this.featureFlagService.getValue(
      Features.isFormSystemInAdminPortalEnabled,
      true,
      user,
    )

    const appSystemPromise =
      this.appSystemApplicationApiWithAuth(
        user,
      ).adminControllerGetSuperAdminCountByTypeIdAndStatus(input)

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(
          user,
        ).adminControllerGetStatisticsForSuperAdmin({
          startDate: input.startDate,
          endDate: input.endDate,
          locale,
        })
      : Promise.resolve([])

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
    const includeFormSystem = await this.featureFlagService.getValue(
      Features.isFormSystemInAdminPortalEnabled,
      true,
      user,
    )

    const appSystemPromise =
      this.appSystemApplicationApiWithAuth(
        user,
      ).adminControllerGetInstitutionCountByTypeIdAndStatus(input)

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(
          user,
        ).adminControllerGetStatisticsForInstitutionAdmin({
          startDate: input.startDate,
          endDate: input.endDate,
          locale,
        })
      : Promise.resolve([])

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
