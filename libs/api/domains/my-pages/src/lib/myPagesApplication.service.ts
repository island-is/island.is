import { Injectable } from '@nestjs/common'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'
import { ApplicationsApi } from '../../../application/gen/fetch'
import { ApplicationApplicationsInput } from '@island.is/api/domains/application'
import { ApplicationsApi as FormSystemApplicationsApi } from '@island.is/clients/form-system'
import { MyPagesApplication } from './myPagesApplication.model'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class MyPagesApplicationService {
  constructor(
    private applicationApi: ApplicationsApi,
    private formSystemApplicationsApi: FormSystemApplicationsApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  formSystemApplicationsApiWithAuth(auth: User) {
    return this.formSystemApplicationsApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async combinedApplications(
    user: User,
    locale: Locale,
    input?: ApplicationApplicationsInput,
  ) {
    const applicationApplications = await this.applicationApiWithAuth(
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
      nationalId: user.nationalId,
      locale,
    })

    const mappedFormSystem = (formSystemApplications ?? []).map(
      (app: any): MyPagesApplication => ({
        ...app,
        typeId: ApplicationTypes.EXAMPLE_INPUTS, // dummy typeId, as form system applications don't have typeId
      }),
    )

    const a = applicationApplications ?? []
    const b = mappedFormSystem ?? []
    if (!a.length && !b.length) return []
    const map = new Map<string, MyPagesApplication>()
    ;[...a, ...b].forEach((app) => {
      if (app) map.set(app.id, app)
    })
    return Array.from(map.values()).sort((x, y) => {
      const xt = x.modified ? new Date(x.modified).getTime() : 0
      const yt = y.modified ? new Date(y.modified).getTime() : 0
      return yt - xt
    })
  }
}
