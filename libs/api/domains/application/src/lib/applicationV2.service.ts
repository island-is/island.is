import { ApplicationsApi, ApplicationTypeAdmin } from '../../gen/fetch'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApplicationCardsInput } from './dto/applicationCards.input'
import { ApplicationCard } from './applicationV2.model'
import {
  ApplicationsApi as FormSystemApplicationsApi,
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

@Injectable()
export class ApplicationV2Service {
  constructor(
    private readonly applicationApi: ApplicationsApi,
    private readonly formSystemApplicationsApi: FormSystemApplicationsApi,
    private readonly formSystemAdminApi: FormSystemAdminApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  formSystemApplicationsApiWithAuth(auth: User) {
    return this.formSystemApplicationsApi.withMiddleware(
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
        this.applicationApiWithAuth(user).applicationControllerFindAll({
          nationalId: user.nationalId,
          locale,
          typeId: input?.typeId?.join(','),
          status: input?.status?.join(','),
          scopeCheck: input?.scopeCheck,
        }),
        this.formSystemApplicationsApiWithAuth(
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
    const applications = await this.applicationApiWithAuth(
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
    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(user).adminControllerFindAllSuperAdmin({
        count: filters.count,
        page: filters.page,
        applicantNationalId: filters.applicantNationalId,
        locale,
        status: filters.status?.join(','),
        from: filters.from,
        to: filters.to,
        typeIdValue: filters.typeIdValue,
        searchStr: filters.searchStr,
      }),
      this.formSystemAdminApiWithAuth(
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
      }),
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

    //TODOxy implement proper pagination
    //Til að styðja við paging í báðum kerfum þurfum við bæði date og síðan id sem tie-breaker ef date er jafnt.
    //Það þarf þá að bæta við í graphql kallið að senda síðasta date og id sem var birt á síðunni til að geta notað
    //það sem upphafspunkt fyrir næstu blaðsíðu.
    //Smá galli í þessari útfærslu að það er basically ekki hægt að fara frá bls 1 yfir á bls 10.
    //Er samt með einhverjar pælingar um hvernig við gætum leyst það.
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
    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(user).adminControllerFindAllSuperAdmin({
        count: filters.count,
        page: filters.page,
        applicantNationalId: filters.applicantNationalId,
        locale,
        status: filters.status?.join(','),
        from: filters.from,
        to: filters.to,
        typeIdValue: filters.typeIdValue,
        searchStr: filters.searchStr,
      }),
      this.formSystemAdminApiWithAuth(
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
      }),
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

    //TODOxy implement proper pagination
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
    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(
        user,
      ).adminControllerGetApplicationTypesSuperAdmin({
        locale,
        nationalId: input.nationalId,
      }),
      this.formSystemAdminApiWithAuth(
        user,
      ).adminControllerGetApplicationTypesForSuperAdmin({
        locale,
        nationalId: input.nationalId,
      }),
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
      formSystemTypes = formSystemSettled.value.map((x) =>
        mapFormSystemApplicationTypeAdmin(x, locale),
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
    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(
        user,
      ).adminControllerGetApplicationTypesInstitutionAdmin({
        locale,
      }),
      this.formSystemAdminApiWithAuth(
        user,
      ).adminControllerGetApplicationTypesForInstitutionAdmin({
        locale,
      }),
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
      formSystemTypes = formSystemSettled.value.map((x) =>
        mapFormSystemApplicationTypeAdmin(x, locale),
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
    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(
        user,
      ).adminControllerGetInstitutionsSuperAdmin({}),
      this.formSystemAdminApiWithAuth(user).adminControllerGetInstitutions({}),
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
    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(
        user,
      ).adminControllerGetSuperAdminCountByTypeIdAndStatus(input),
      this.formSystemAdminApiWithAuth(
        user,
      ).adminControllerGetStatisticsForSuperAdmin(input),
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
      formSystemStatistics = formSystemSettled.value.map((x) =>
        mapFormSystemStatisticsAdmin(x, locale),
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
    const [appSystemSettled, formSystemSettled] = await Promise.allSettled([
      this.applicationApiWithAuth(
        user,
      ).adminControllerGetInstitutionCountByTypeIdAndStatus(input),
      this.formSystemAdminApiWithAuth(
        user,
      ).adminControllerGetStatisticsForInstitutionAdmin(input),
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
      formSystemStatistics = formSystemSettled.value.map((x) =>
        mapFormSystemStatisticsAdmin(x, locale),
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
