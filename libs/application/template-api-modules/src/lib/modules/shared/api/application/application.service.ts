import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  CustomTemplateFindQuery,
  Application,
  ExistingApplicationParameters,
} from '@island.is/application/types'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import { TemplateApiModuleActionProps } from '../../../../types'
import { HistoryService } from '@island.is/application/api/history'

type ApplicationInfo = Omit<Application, 'externalData'>

@Injectable()
export class ApplicationService extends BaseTemplateApiService {
  constructor(
    private readonly applicationApiService: ApplicationApiService,
    private readonly historyService: HistoryService,
  ) {
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

    const findExistingApplications =
      this.applicationApiService.customTemplateFindQuery(
        application.typeId,
      ) as CustomTemplateFindQuery

    const existingApplications = await findExistingApplications({
      [where.applicant]: application.applicant,
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

  async mockProvider({ params }: TemplateApiModuleActionProps): Promise<any> {
    return params
  }
}
