import formatISO from 'date-fns/formatISO'

import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import type { CaseType, User } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { EventService } from '../event'

type SubTypes = { [c in CaseType]: string | [string, string] }
//
// Maps case types to sub types in the court system
export const subTypes: SubTypes = {
  // 'Afhending gagna',
  // 'Afturköllun á skipun verjanda',
  OTHER: 'Annað',
  TRACKING_EQUIPMENT: 'Eftirfarabúnaður',
  TRAVEL_BAN: ['Farbann', 'Framlenging farbanns'],
  // 'Framlenging frests',
  // 'Framsalsmál',
  // 'Frestur',
  CUSTODY: ['Gæsluvarðhald', 'Framlenging gæsluvarðhalds'],
  // TODO: replace with appropriate type when it has been created in the court system
  ADMISSION_TO_FACILITY: ['Gæsluvarðhald', 'Framlenging gæsluvarðhalds'],
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
  // TODO: replace with appropriate type when it has been created in the court system
  VIDEO_RECORDING_EQUIPMENT: 'Annað',
}

@Injectable()
export class CourtService {
  constructor(
    private readonly courtClientService: CourtClientService,
    private readonly eventService: EventService,
  ) {}

  private uploadStream(
    courtId: string,
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
    user: User,
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    fileName: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      `${fileName}.pdf`,
      'application/pdf',
      content,
    )
      .then((streamId) =>
        this.courtClientService.createDocument(courtId, {
          caseNumber: courtCaseNumber,
          subject: fileName,
          fileName: `${fileName}.pdf`,
          streamID: streamId,
          caseFolder: 'Krafa og greinargerð',
        }),
      )
      .catch((reason) => {
        this.eventService.postErrorEvent(
          'Failed to create a court request',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
          },
          reason,
        )

        throw reason
      })
  }

  async createCourtRecord(
    user: User,
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    fileName: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      `${fileName}.pdf`,
      'application/pdf',
      content,
    )
      .then((streamId) =>
        this.courtClientService.createThingbok(courtId, {
          caseNumber: courtCaseNumber,
          subject: fileName,
          fileName: `${fileName}.pdf`,
          streamID: streamId,
        }),
      )
      .catch((reason) => {
        this.eventService.postErrorEvent(
          'Failed to create a court record',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            fileName,
          },
          reason,
        )

        throw reason
      })
  }

  async createRuling(
    user: User,
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    fileName: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(
      courtId,
      `${fileName}.pdf`,
      'application/pdf',
      content,
    )
      .then((streamId) =>
        this.courtClientService.createDocument(courtId ?? '', {
          caseNumber: courtCaseNumber,
          subject: fileName,
          fileName: `${fileName}.pdf`,
          streamID: streamId,
          caseFolder: 'Dómar, úrskurðir og Þingbók',
        }),
      )
      .catch((reason) => {
        this.eventService.postErrorEvent(
          'Failed to create a court ruling',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            fileName,
          },
          reason,
        )

        throw reason
      })
  }

  async createDocument(
    user: User,
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    subject: string,
    fileName: string,
    fileType: string,
    content: Buffer,
  ): Promise<string> {
    return this.uploadStream(courtId, fileName, fileType, content)
      .then((streamId) =>
        this.courtClientService.createDocument(courtId, {
          caseNumber: courtCaseNumber,
          subject,
          fileName,
          streamID: streamId,
          caseFolder: 'Gögn málsins',
        }),
      )
      .catch((reason) => {
        this.eventService.postErrorEvent(
          'Failed to create a court document',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            subject,
            fileName,
            fileType,
          },
          reason,
        )

        throw reason
      })
  }

  async createCourtCase(
    user: User,
    caseId: string,
    courtId: string,
    type: CaseType,
    policeCaseNumber: string,
    isExtension: boolean,
  ): Promise<string> {
    let subType = subTypes[type]
    if (Array.isArray(subType)) {
      subType = subType[isExtension ? 1 : 0]
    }

    return this.courtClientService
      .createCase(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: subType,
        status: 'Skráð',
        receivalDate: formatISO(nowFactory(), { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumber,
      })
      .catch((reason) => {
        this.eventService.postErrorEvent(
          'Failed to create a court case',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            type,
            policeCaseNumber,
            isExtension,
          },
          reason,
        )

        throw reason
      })
  }

  async createEmail(
    user: User,
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    subject: string,
    body: string,
    recipients: string,
    fromEmail: string,
    fromName: string,
  ): Promise<string> {
    return this.courtClientService
      .createEmail(courtId, {
        caseNumber: courtCaseNumber,
        subject,
        body,
        recipients,
        fromEmail,
        fromName,
      })
      .catch((reason) => {
        this.eventService.postErrorEvent(
          'Failed to create an email',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            subject,
            body,
            recipients,
            fromEmail,
            fromName,
          },
          reason,
        )

        throw reason
      })
  }
}
