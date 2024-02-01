import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'
import { MinistryOfJusticeService } from '@island.is/api/domains/ministry-of-justice'
import { JournalControllerValidateRequest } from '@island.is/clients/dmr'

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
  async validateAdvert(auth: User, params: JournalControllerValidateRequest) {
    console.log('from template api:', params)
    return await this.ministryOfJusticeService.validateAdvert(auth, params)
  }

  async submitApplication(auth: User) {
    return await this.ministryOfJusticeService.submitApplication(auth)
  }
}
