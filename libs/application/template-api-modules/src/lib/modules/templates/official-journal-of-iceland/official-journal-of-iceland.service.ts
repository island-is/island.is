import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { User } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'

const MOCK_RESPONSE = {
  data: {
    departments: [
      { label: 'A-Deild', value: 'A-Deild' },
      { label: 'B-Deild', value: 'B-Deild' },
      { label: 'C-Deild', value: 'C-Deild' },
      { label: 'D-Deild', value: 'D-Deild' },
    ],
    categories: [
      { label: 'Gjaldskrá', value: 'Gjaldskrá' },
      { label: 'Auglýsing', value: 'Auglýsing' },
      { label: 'Reglugerð', value: 'Reglugerð' },
      { label: 'Skipulagsskrá', value: 'Skipulagsskrá' },
      { label: 'Fjallskilasamþykkt', value: 'Fjallskilasamþykkt' },
      { label: 'Reglur', value: 'Reglur' },
      { label: 'Samþykkt', value: 'Samþykkt' },
    ],
    subCategories: [
      { label: 'Skipulagsreglugerð', value: 'Skipulagsreglugerð' },
      { label: 'Byggingarreglugerð', value: 'Byggingarreglugerð' },
      { label: 'Hafnarreglugerð', value: 'Hafnarreglugerð' },
    ],
    templates: [
      { label: 'Skipulagsmál', value: 'Skipulagsmál' },
      { label: 'Auglýsing með töflu', value: 'Auglýsing með töflu' },
      { label: 'Breytingar á gjaldskrá', value: 'Breytingar á gjaldskrá' },
    ],
    signatureTypes: [
      { label: 'Einföld undirritun', value: 'Einföld undirritun' },
      { label: 'Tvöföld undirritun', value: 'Tvöföld undirritun' },
      { label: 'Undirritun ráðherra', value: 'Undirritun ráðherra' },
      { label: 'Undirritun nefndar', value: 'Undirritun nefndar' },
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
