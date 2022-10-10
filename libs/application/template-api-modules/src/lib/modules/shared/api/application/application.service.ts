import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { UserProfileApi } from '@island.is/clients/user-profile'

import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  CustomTemplateFindQuery,
  Application,
  ExistingApplicatiosnParameters,
} from '@island.is/application/types'

type ApplicationInfo = Omit<Application, 'externalData'>

@Injectable()
export class ApplicationService extends BaseTemplateApiService {
  constructor() {
    super('Application')
  }

  async existingApplication(
    {
      application,
      params,
    }: TemplateApiModuleActionProps<ExistingApplicatiosnParameters>,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<ApplicationInfo[] | undefined> {
    // Returns only an application with the same active announcment
    const existingApplications = (
      await customTemplateFindQuery({
        applicant: application.applicant,
      })
    )
      .map<ApplicationInfo>(
        ({ externalData, ...partialApplication }) => partialApplication,
      )
      // The casenumber is mapped to answers on application entry in the initial state (see service.syslumennOnEntry)
      // It is therefore the case that a correctly formed application will have the casenumber
      // in the answers. A malformed application will not be considered.

      // The prerequisites states are not listed and will be pruned anyways
      .filter(
        ({ id, state, answers }) =>
          id !== application.id && params?.states.includes(state), //&&
        // answers?.caseNumber === application.answers?.caseNumber,
      )
      .sort(({ created: a }, { created: b }) => b.getTime() - a.getTime())

    return existingApplications
  }
}
