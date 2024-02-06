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

  async departments(user: User) {
    return this.ministryOfJusticeService.departments(user)
  }

  async types(user: User) {
    return this.ministryOfJusticeService.types(user, {})
  }
}
