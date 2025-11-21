import { ApplicationsApi } from '../../gen/fetch'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class ApplicationV2Service {
  constructor(
    private readonly applicationApi: ApplicationsApi,
    private readonly formSystemApplicationsApi: FormSystemApplicationsApi,
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
    const applications = await this.applicationApiWithAuth(
      user,
    ).applicationControllerFindAll({
      nationalId: user.nationalId,
      locale,
      typeId: input?.typeId?.join(','),
      status: input?.status?.join(','),
      scopeCheck: input?.scopeCheck,
    })

    const formSystemApplications = await this.formSystemApplicationsApiWithAuth(
      user,
    ).applicationsControllerFindAllByUser({
      locale,
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
    const formSystemCards = formSystemApplications.map(
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
    return [...appSystemCards, ...formSystemCards].sort(
      (a, b) => b.modified.getTime() - a.modified.getTime(),
    )
  }
}
