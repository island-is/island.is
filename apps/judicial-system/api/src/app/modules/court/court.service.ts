import { formatISO } from 'date-fns' // eslint-disable-line no-restricted-imports

import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import type { CaseType } from '@island.is/judicial-system/types'

// Maps case types to sub types in the court system
const subTypes = {
  // 'Afhending gagna',
  // 'Afturköllun á skipun verjanda',
  OTHER: 'Annað',
  TRACKING_EQUIPMENT: 'Eftirfarabúnaður',
  TRAVEL_BAN: ['Farbann', 'Framlenging farbanns'],
  // 'Framlenging frests',
  // 'Framsalsmál',
  // 'Frestur',
  CUSTODY: ['Gæsluvarðhald', 'Framlenging gæsluvarðhalds'],
  PSYCHIATRIC_EXAMINATION: 'Geðrannsókn',
  // 'Handtaka',
  SOUND_RECORDING_EQUIPMENT: 'Hljóðupptökubúnaði komið fyrir',
  SEARCH_WARRANT: 'Húsleit',
  AUTOPSY: 'Krufning',
  // 'Lausn út öryggisgæslu',
  BODY_SEARCH: 'Leit og líkamsrannsókn',
  // 'Lögmæti rannsóknarathafna',
  // 'Nálgunarbann',
  // 'Réttarstaða afplánunarfanga',
  // 'Réttarstaða gæsluvarðhaldsfanga',
  // 'Rof á reynslulausn',
  BANKING_SECRECY_WAIVER: 'Rof bankaleyndar',
  // 'Sekt vitnis',
  // 'Sektir málflytjenda',
  PHONE_TAPPING: 'Símhlerun',
  // 'Skýrslutaka brotaþola eldri en 18 ára',
  // 'Skýrslutaka brotaþola yngri en 18 ára',
  // 'Skýrslutaka fyrir dómi',
  TELECOMMUNICATIONS: 'Upplýsingar um fjarskiptasamskipti',
  INTERNET_USAGE: 'Upplýsingar um vefnotkun',
}

@Injectable()
export class CourtService {
  constructor(private readonly courtClientService: CourtClientService) {}

  createCourtCase(
    courtId: string,
    type: CaseType,
    policeCaseNumber: string,
    isExtension: boolean,
  ): Promise<string> {
    let subType = subTypes[type]
    if (Array.isArray(subType)) {
      subType = subType[isExtension ? 1 : 0]
    }

    return this.courtClientService.createCase(courtId, {
      caseType: 'R - Rannsóknarmál',
      subtype: subType,
      status: 'Skráð',
      receivalDate: formatISO(new Date(), { representation: 'date' }),
      basedOn: 'Rannsóknarhagsmunir',
      sourceNumber: policeCaseNumber,
    })
  }
}
