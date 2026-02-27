import { ApplicationsApi, ApplicationTypeAdmin } from '../../gen/fetch'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApplicationCardsInput } from './dto/applicationCards.input'
import { ApplicationCard } from './applicationV2.model'
import {
  ApplicationsApi as FormSystemApplicationApi,
  AdminApi as FormSystemAdminApi,
} from '@island.is/clients/form-system'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationsAdminFilters,
  ApplicationsAdminStatisticsInput,
  ApplicationsSuperAdminFilters,
  ApplicationTypesAdminInput,
} from './application-admin/dto/applications-admin-inputs'
import {
  applicationAdminSortByCreated,
  cardSortByModified,
  mapAppSystemCards,
  mapFormSystemApplicationAdmin,
  mapFormSystemApplicationTypeAdmin,
  mapFormSystemCards,
  mapFormSystemInstitutionAdmin,
  mapFormSystemStatisticsAdmin,
} from './utils'
import {
  ApplicationAdminPaginatedResponse,
  ApplicationAdmin,
  ApplicationInstitution,
  ApplicationStatistics,
} from './application.model'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

@Injectable()
export class ApplicationV2Service {
  constructor(
    private readonly appSystemApplicationApi: ApplicationsApi,
    private readonly formSystemApplicationApi: FormSystemApplicationApi,
    private readonly formSystemAdminApi: FormSystemAdminApi,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  appSystemApplicationApiWithAuth(auth: Auth) {
    return this.appSystemApplicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  formSystemApplicationApiWithAuth(auth: User) {
    return this.formSystemApplicationApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  formSystemAdminApiWithAuth(auth: User) {
    return this.formSystemAdminApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getApplicationCards(
    user: User,
    locale: Locale,
    input: ApplicationCardsInput,
  ): Promise<ApplicationCard[]> {
    let appSystemCards: ApplicationCard[] = []
    let formSystemCards: ApplicationCard[] = []
    const [applicationsSettled, formSystemApplicationsSettled] =
      await Promise.allSettled([
        this.appSystemApplicationApiWithAuth(user).applicationControllerFindAll(
          {
            nationalId: user.nationalId,
            locale,
            typeId: input?.typeId?.join(','),
            status: input?.status?.join(','),
            scopeCheck: input?.scopeCheck,
          },
        ),
        this.formSystemApplicationApiWithAuth(
          user,
        ).applicationsControllerFindAllByUser({
          locale,
        }),
      ])

    if (applicationsSettled.status === 'fulfilled') {
      appSystemCards = applicationsSettled.value.map(mapAppSystemCards)
    } else {
      this.logger.error(
        'Error getting application system cards',
        applicationsSettled.reason,
      )
    }
    if (formSystemApplicationsSettled.status === 'fulfilled') {
      formSystemCards =
        formSystemApplicationsSettled.value.map(mapFormSystemCards)
    } else {
      this.logger.error(
        'Error getting form system cards',
        formSystemApplicationsSettled.reason,
      )
    }
    return [...appSystemCards, ...formSystemCards].sort(cardSortByModified)
  }

  async getApplicationSystemCards(
    user: User,
    locale: Locale,
    input: ApplicationCardsInput,
  ): Promise<ApplicationCard[]> {
    const applications = await this.appSystemApplicationApiWithAuth(
      user,
    ).applicationControllerFindAll({
      nationalId: user.nationalId,
      locale,
      typeId: input?.typeId?.join(','),
      status: input?.status?.join(','),
      scopeCheck: input?.scopeCheck,
    })

    const appSystemCards = applications.map(mapAppSystemCards)
    return appSystemCards.sort(cardSortByModified)
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

    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerFindAllSuperAdmin({
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

    const formSystemPromise = includeFormSystem
      ? this.formSystemAdminApiWithAuth(
          user,
        ).adminControllerGetOverviewForSuperAdmin({
          count: filters.count,
          page: filters.page,
          applicantNationalId: filters.applicantNationalId,
          locale,
          from: filters.from,
          to: filters.to,
          formId: filters.typeIdValue,
          searchStr: filters.searchStr,
          institutionNationalId: filters.institutionNationalId,
        })
      : Promise.resolve({ rows: [] })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemRows: ApplicationAdmin[] = []
    let formSystemRows: ApplicationAdmin[] = []
    if (appSystemSettled.status === 'fulfilled') {
      appSystemRows = appSystemSettled.value.rows
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
    } else {
      this.logger.error(
        'Error getting form system applications for super-admin',
        formSystemSettled.reason,
      )
    }

    const mergedRows: ApplicationAdmin[] = [...appSystemRows, ...formSystemRows]

    mergedRows.sort(applicationAdminSortByCreated)
    mergedRows.slice(0, filters.count)

    return {
      rows: mergedRows,
      count: mergedRows.length,
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

    const appSystemPromise = this.appSystemApplicationApiWithAuth(
      user,
    ).adminControllerFindAllSuperAdmin({
      count: filters.count,
      page: filters.page,
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
          count: filters.count,
          page: filters.page,
          applicantNationalId: filters.applicantNationalId,
          locale,
          from: filters.from,
          to: filters.to,
          formId: filters.typeIdValue,
          searchStr: filters.searchStr,
        })
      : Promise.resolve({ rows: [] })

    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      appSystemPromise,
      formSystemPromise,
    ])

    let appSystemRows: ApplicationAdmin[] = []
    let formSystemRows: ApplicationAdmin[] = []
    if (appSystemSettled.status === 'fulfilled') {
      appSystemRows = appSystemSettled.value.rows
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
    } else {
      this.logger.error(
        'Error getting form system applications for institution admin',
        formSystemSettled.reason,
      )
    }

    const mergedRows: ApplicationAdmin[] = [...appSystemRows, ...formSystemRows]

    mergedRows.sort(applicationAdminSortByCreated)
    mergedRows.slice(0, filters.count)

    return {
      rows: mergedRows,
      count: mergedRows.length,
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
