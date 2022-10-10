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
      const applicant = application['applicant']
    const existingApplications = await findExistingApplications(where)
    // ({
    //   applicant: application.applicant,
    // })
    console.log('\n\n\nexistingApplications', existingApplications.length)
    existingApplications
      .map<ApplicationInfo>(
        ({ externalData, ...partialApplication }) => partialApplication,
      )
      // The casenumber is mapped to answers on application entry in the initial state (see service.syslumennOnEntry)
      // It is therefore the case that a correctly formed application will have the casenumber
      // in the answers. A malformed application will not be considered.

      // The prerequisites states are not listed and will be pruned anyways
      .filter(
        ({ id, state, answers }) =>
          id !== application.id && states.includes(state), //&&
        // answers?.caseNumber === application.answers?.caseNumber,
      )
      .sort(({ created: a }, { created: b }) => b.getTime() - a.getTime())

    return existingApplications
  }
}
