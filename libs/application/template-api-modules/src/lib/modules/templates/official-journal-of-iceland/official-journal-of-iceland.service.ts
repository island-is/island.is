import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  OfficialJournalOfIcelandService,
  QueryParams,
  TypeQueryParams,
} from '@island.is/api/domains/official-journal-of-iceland'
import { TemplateApiModuleActionProps } from '../../../types'
import { OJOIApplication } from '@island.is/application/templates/official-journal-of-iceland'
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
    } catch (error) {
      return false
    }
  }
}
