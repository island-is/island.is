import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { UserProfileApi } from '@island.is/clients/user-profile'

import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  CustomTemplateFindQuery,
  Application,
  ExistingApplicationParameters,
} from '@island.is/application/types'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'

type ApplicationInfo = Omit<Application, 'externalData'>

@Injectable()
export class ApplicationService extends BaseTemplateApiService {
  constructor(private readonly applicationApiService: ApplicationApiService) {
    super('Application')
  }

  async existingApplication({
    application,
    params,
  }: TemplateApiModuleActionProps<ExistingApplicationParameters>): Promise<
    ApplicationInfo[] | undefined
  > {
    if (!params) {
      return undefined
    }
    const { states, where } = params
    // Returns only an application with the same active announcment
    const findExistingApplications = this.applicationApiService.customTemplateFindQuery(
      application.typeId,
    ) as CustomTemplateFindQuery

    // TODO: Id is used in parental leave should add id or find a more dynamic way to get info from the application
    const existingApplications = await findExistingApplications({
      [where.applicant]: application['applicant'],
    })

    const e: ApplicationInfo[] = existingApplications
      .map<ApplicationInfo>(
        ({ externalData, ...partialApplication }) => partialApplication,
      )
      .filter(
        ({ id, state }) => id !== application.id && states.includes(state),
      )
      .sort(({ created: a }, { created: b }) => b.getTime() - a.getTime())
    return e
  }
}
