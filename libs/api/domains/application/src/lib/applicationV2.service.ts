import { ApplicationsApi } from '../../gen/fetch'
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
import { ApplicationsSuperAdminFilters } from './application-admin/dto/applications-admin-inputs'
import {
  applicationAdminSortByCreated,
  cardSortByModified,
  mapAppSystemCards,
  mapFormSystemApplicationAdmin,
  mapFormSystemCards,
} from './utils'
import {
  ApplicationAdminPaginatedResponse,
  ApplicationAdmin,
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

  async findAllSuperAdmin(
    user: User,
    locale: Locale,
    filters: ApplicationsSuperAdminFilters,
  ): Promise<ApplicationAdminPaginatedResponse | null> {
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
      formSystemRows = (formSystemSettled.value.applications ?? []).map(
        mapFormSystemApplicationAdmin,
      )
    } else {
      this.logger.error(
        'Error getting form system applications for super-admin',
        formSystemSettled.reason,
      )
    }

    const mergedRows: ApplicationAdmin[] = [...appSystemRows, ...formSystemRows]

    //TODOxy: Til að styðja við paging í báðum kerfum þurfum við bæði date og síðan id sem tie-breaker ef date er jafnt.
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

  // TODOxy add rest of endpoints that are in V1 service
}
