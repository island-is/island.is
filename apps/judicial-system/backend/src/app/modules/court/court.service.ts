import formatISO from 'date-fns/formatISO'

import { Inject, Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import type { CaseType } from '@island.is/judicial-system/types'

import { DATE_FACTORY } from '../../factories'

// Maps case types to sub types in the court system
export const subTypes = {
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
  RESTRAINING_ORDER: 'Nálgunarbann',
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
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION: 'Rannsókn á rafrænum gögnum',
}

@Injectable()
export class CourtService {
  constructor(
    @Inject(DATE_FACTORY) private readonly today: () => Date,
    private readonly courtClientService: CourtClientService,
  ) {}

  private uploadStream(
    courtId: string | undefined,
    fileName: string,
    contentType: string,
    content: Buffer,
  ): Promise<string> {
    return this.courtClientService.uploadStream(courtId ?? '', {
      value: content,
      options: { filename: fileName, contentType },
    })
  }

  async createRequest(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      'Krafa.pdf',
      'application/pdf',
      content,
    ).then((streamId) =>
      this.courtClientService.createDocument(courtId ?? '', {
        caseNumber: courtCaseNumber ?? '',
        subject: 'Krafa',
        fileName: 'Krafa.pdf',
        streamID: streamId,
        caseFolder: 'Krafa og greinargerð',
      }),
    )
  }

  async createCourtRecord(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    fileName: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      `${fileName}.pdf`,
      'application/pdf',
      content,
    ).then((streamId) =>
      this.courtClientService.createThingbok(courtId ?? '', {
        caseNumber: courtCaseNumber ?? '',
        subject: fileName,
        fileName: `${fileName}.pdf`,
        streamID: streamId,
      }),
    )
  }

  async createRuling(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    fileName: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      `${fileName}.pdf`,
      'application/pdf',
      content,
    ).then((streamId) =>
      this.courtClientService.createDocument(courtId ?? '', {
        caseNumber: courtCaseNumber ?? '',
        subject: fileName,
        fileName: `${fileName}.pdf`,
        streamID: streamId,
        caseFolder: 'Dómar, úrskurðir og Þingbók',
      }),
    )
  }

  async createDocument(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    subject: string,
    fileName: string,
    fileType: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(courtId, fileName, fileType, content).then(
      (streamId) =>
        this.courtClientService.createDocument(courtId ?? '', {
          caseNumber: courtCaseNumber ?? '',
          subject,
          fileName,
          streamID: streamId,
          caseFolder: 'Gögn málsins',
        }),
    )
  }

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
      receivalDate: formatISO(this.today(), { representation: 'date' }),
      basedOn: 'Rannsóknarhagsmunir',
      sourceNumber: policeCaseNumber,
    })
  }
}
