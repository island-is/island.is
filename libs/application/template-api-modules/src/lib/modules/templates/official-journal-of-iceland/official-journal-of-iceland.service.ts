import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  OfficialJournalOfIcelandService,
  QueryParams,
  TypeQueryParams,
} from '@island.is/api/domains/official-journal-of-iceland'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  OJOIApplication,
  error as ojoiErrorMessages,
} from '@island.is/application/templates/official-journal-of-iceland'
import { TemplateApiError } from '@island.is/nest/problem'
import { OfficialJournalOfIcelandApplicationService } from '@island.is/api/domains/official-journal-of-iceland-application'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: OJOIApplication
}

@Injectable()
export class OfficialJournalOfIcelandTemaplateService extends BaseTemplateApiService {
  constructor(
    private readonly ojoiService: OfficialJournalOfIcelandService,
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationService,
  ) {
    super(ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND)
  }

  async getDepartments(params: QueryParams) {
    return this.ojoiService.getDepartments(params)
  }

  async getAdvertTypes(params: TypeQueryParams) {
    return this.ojoiService.getAdvertTypes(params)
  }

  async postApplication({ application, auth }: Props): Promise<boolean> {
    try {
      return await this.ojoiApplicationService.postApplication(
        {
          id: application.id,
        },
        auth,
      )
    } catch {
      // Throw rather than return false: the SUBMITTED onEntry action has
      // throwOnError, so a failed post keeps the application in its draft
      // state and the applicant can submit again. Returning false recorded
      // the action as a success and left a submitted application with no case.
      // The client has already logged the underlying error.
      throw new TemplateApiError(
        {
          title: ojoiErrorMessages.postApplicationFailedTitle,
          summary: ojoiErrorMessages.postApplicationFailedMessage,
        },
        500,
      )
    }
  }
}
