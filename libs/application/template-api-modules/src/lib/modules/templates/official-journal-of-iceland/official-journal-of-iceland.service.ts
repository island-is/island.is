import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'

const MOCK_RESPONSE = {
  data: {
    departments: [
      { value: '0', label: 'A-deild' },
      { value: '1', label: 'B-deild' },
      { value: '2', label: 'C-deild' },
    ],
    categories: [
      { value: '0', label: 'Gjaldskrá' },
      { value: '1', label: 'Auglýsing' },
      { value: '2', label: 'Reglugerð' },
      { value: '3', label: 'Skipulagsskrá' },
      { value: '4', label: 'Fjallskilasamþykkt' },
      { value: '5', label: 'Reglur' },
      { value: '6', label: 'Samþykkt' },
    ],
    subCategories: [
      { value: '0', label: 'Skipulagsreglugerð' },
      { value: '1', label: 'Byggingarreglugerð' },
      { value: '2', label: 'Hafnarreglugerð' },
    ],
    templates: [
      { value: '0', label: 'Skipulagsmál' },
      { value: '1', label: 'Auglýsing með töflu' },
      { value: '2', label: 'Breytingar á gjaldskrá' },
    ],
    signatureTypes: [
      { value: '0', label: 'Einföld undirritun' },
      { value: '1', label: 'Tvöföld undirritun' },
      { value: '2', label: 'Undirritun ráðherra' },
      { value: '3', label: 'Undirritun nefndar' },
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
