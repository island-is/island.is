import { ApplicationsApi } from '../../gen/fetch'
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
  cardSortByModified,
  mapAppSystemCards,
  mapFormSystemCards,
} from './utils'

@Injectable()
export class ApplicationV2Service {
  constructor(
    private readonly appSystemApplicationApi: ApplicationsApi,
    private readonly formSystemApplicationApi: FormSystemApplicationApi,
    private readonly formSystemAdminApi: FormSystemAdminApi,
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
}
