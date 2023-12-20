import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'

const MOCK_RESPONSE = {
  data: {
    departments: ['B-Deild'], // 'A-Deild', 'C-Deild', 'D-Deild'
    categories: [
      'Gjaldskrá',
      'Auglýsing',
      'Reglugerð',
      'Skipulagsskrá',
      'Fjallskilasamþykkt',
      'Reglur',
      'Samþykkt',
    ],
    subCategories: [
      'Skipulagsreglugerð',
      'Byggingarreglugerð',
      'Hafnarreglugerð',
    ],
    templates: [
      'Skipulagsmál',
      'Auglýsing með töflu',
      'Breytingar á gjaldskrá',
    ],
    signatureTypes: [
      'Einföld undirritun',
      'Tvöföld undirritun',
      'Undirritun ráðherra',
      'Undirritun nefndar',
    ],
  },
}
@Injectable()
export class OfficialJournalOfIcelandService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND)
  }

  async getOptions(auth: User) {
    return MOCK_RESPONSE.data
  }
}
