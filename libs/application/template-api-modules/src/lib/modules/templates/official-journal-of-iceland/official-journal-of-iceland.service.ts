import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { OfficialJournalOfIcelandService } from '@island.is/api/domains/official-journal-of-iceland'
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

  async departments() {
    return this.ojoiService.departments({})
  }

  async types() {
    return this.ojoiService.types({})
  }

  async postApplication({ application, auth }: Props): Promise<boolean> {
    try {
      return await this.ojoiApplicationService.postApplication({
        id: application.id,
      })
    } catch (error) {
      return false
    }
  }
}
