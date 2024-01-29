import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'
import { MinistryOfJusticeService } from '@island.is/api/domains/ministry-of-justice'

@Injectable()
export class OfficialJournalOfIcelandService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly ministryOfJusticeService: MinistryOfJusticeService,
  ) {
    super(ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND)
  }

  async getOptions(auth: User) {
    const { data } = await this.ministryOfJusticeService.getOptions(auth)

    return data
  }
  async validateApplication(auth: User) {
    return await this.ministryOfJusticeService.validateApplication(auth)
  }
}
