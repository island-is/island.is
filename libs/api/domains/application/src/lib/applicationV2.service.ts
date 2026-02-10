import { ApplicationsApi } from '../../gen/fetch'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApplicationCardsInput } from './dto/applicationCards.input'
import { ApplicationCard } from './applicationV2.model'
import { ApplicationResponseDtoStatusEnum } from '../../gen/fetch/models/ApplicationResponseDto'
import { ApplicationsApi as FormSystemApplicationsApi } from '@island.is/clients/form-system'
import {
  institutionMapper,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationsSuperAdminFilters } from './application-admin/dto/applications-admin-inputs'

@Injectable()
export class ApplicationV2Service {
  constructor(
    private readonly applicationApi: ApplicationsApi,
    private readonly formSystemApplicationsApi: FormSystemApplicationsApi,
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
      appSystemCards = applicationsSettled.value.map(
        (application): ApplicationCard => {
          return {
            id: application.id,
            created: application.created,
            modified: application.modified,
            typeId: application.typeId,
            status: application.status,
            name: application.name,
            progress: application.progress,
            slug: ApplicationConfigurations[application.typeId]?.slug,
            org: institutionMapper[application.typeId].slug,
            applicationPath: `umsoknir/${
              ApplicationConfigurations[application.typeId]?.slug
            }/${application.id}`,
            orgContentfulId: institutionMapper[application.typeId].contentfulId,
            nationalId: institutionMapper[application.typeId].nationalId,
            actionCard: application.actionCard,
          }
        },
      )
    } else {
      this.logger.error(
        'Error getting application system cards',
        applicationsSettled.reason,
      )
    }
    if (formSystemApplicationsSettled.status === 'fulfilled') {
      formSystemCards = formSystemApplicationsSettled.value.map(
        (application): ApplicationCard => {
          return {
            id: application.id,
            created: application.created,
            modified: application.modified,
            typeId: application.typeId,
            status: application.status as ApplicationResponseDtoStatusEnum,
            name: application.name,
            progress: application.progress,
            slug: application.formSystemFormSlug,
            org: application.formSystemOrgSlug,
            applicationPath: `form/${application.formSystemFormSlug}/${application.id}`,
            orgContentfulId: application.formSystemOrgContentfulId,
            nationalId: undefined, // TODO: add nationalId if possible
            actionCard: application.actionCard,
          }
        },
      )
    } else {
      this.logger.error(
        'Error getting form system cards',
        formSystemApplicationsSettled.reason,
      )
    }
    return [...appSystemCards, ...formSystemCards].sort(
      (a, b) => b.modified.getTime() - a.modified.getTime(),
    )
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

    const appSystemCards = applications.map((application): ApplicationCard => {
      return {
        id: application.id,
        created: application.created,
        modified: application.modified,
        typeId: application.typeId,
        status: application.status,
        name: application.name,
        progress: application.progress,
        slug: ApplicationConfigurations[application.typeId]?.slug,
        org: institutionMapper[application.typeId].slug,
        applicationPath: `umsoknir/${
          ApplicationConfigurations[application.typeId]?.slug
        }/${application.id}`,
        orgContentfulId: institutionMapper[application.typeId].contentfulId,
        nationalId: institutionMapper[application.typeId].nationalId,
        actionCard: application.actionCard,
      }
    })
    return appSystemCards.sort(
      (a, b) => b.modified.getTime() - a.modified.getTime(),
    )
  }

  async findAllSuperAdmin(
    user: User,
    locale: Locale,
    filters: ApplicationsSuperAdminFilters,
  ) {
    // TODOxy Veit ekki hvort við getum notað ApplicationCard, en það er notað á mínum síðum og væri nice að geta samnýtt.
    // Mínar síður útfæra samt ekki paging í dag svo líklegast þarf bæta við stuðningi við paging.

    const returnCards: ApplicationCard[] = []

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
      // TODOxy útfæra endapunkt í form-system
      this.formSystemApplicationsApiWithAuth(
        user,
      ).applicationsControllerFindAllByUser({
        locale,
      }),
    ])

    //TODOxy
    return { rows: [], count: 0 }

    // TODOxy Hér þarf mögulega að mappa einhver gögn svo þau passi við týpuna.
    // const appSystemCards: ApplicationCard[] = appSystemSettled.value
    // const formSystemCards: ApplicationCard[]  = formSystemSettled.value

    // returnCards.add(formSystemCards).add(appSystemCards)

    // //TODOxy: Til að styðja við paging í báðum kerfum þurfum við bæði date og síðan id sem tie-breaker ef date er jafnt.
    // //Það þarf þá að bæta við í graphql kallið að senda síðasta date og id sem var birt á síðunni til að geta notað
    // //það sem upphafspunkt fyrir næstu blaðsíðu.
    // //Smá galli í þessari útfærslu að það er basically ekki hægt að fara frá bls 1 yfir á bls 10.
    // //Er samt með einhverjar pælingar um hvernig við gætum leyst það.
    // returnCards.sort(this.applicationCardComparatorDesc)
    // returnCards.slice(0, count)

    // return returnCards
  }

  private applicationCardComparatorDesc = (
    a: ApplicationCard,
    b: ApplicationCard,
  ): number => {
    const createdDiff = b.created.getTime() - a.created.getTime()
    if (createdDiff !== 0) {
      return createdDiff
    }

    return a.id.localeCompare(b.id)
  }
}
