import formatISO from 'date-fns/formatISO'

import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import {
  CaseType,
  IndictmentSubType,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { EventService } from '../event'

export enum CourtDocumentFolder {
  REQUEST_DOCUMENTS = 'Krafa og greinargerð',
  INDICTMENT_DOCUMENTS = 'Ákæra og greinargerð',
  CASE_DOCUMENTS = 'Gögn málsins',
  COURT_DOCUMENTS = 'Dómar, úrskurðir og Þingbók',
}

export type SubType = Exclude<CaseType, CaseType.INDICTMENT>

type CourtSubTypes = {
  [c in SubType | IndictmentSubType]: string | [string, string]
}

// Maps case types to sub types in the court system
export const courtSubTypes: CourtSubTypes = {
  ALCOHOL_LAWS: 'Áfengislagabrot',
  CHILD_PROTECTION_LAWS: 'Barnaverndarlög',
  INDECENT_EXPOSURE: 'Blygðunarsemisbrot',
  LEGAL_ENFORCEMENT_LAWS: 'Brot gegn lögreglulögum',
  POLICE_REGULATIONS: 'Brot gegn lögreglusamþykkt',
  INTIMATE_RELATIONS: 'Brot í nánu sambandi',
  PUBLIC_SERVICE_VIOLATION: 'Brot í opinberu starfi',
  PROPERTY_DAMAGE: 'Eignaspjöll',
  NARCOTICS_OFFENSE: 'Fíkniefnalagabrot',
  EMBEZZLEMENT: 'Fjárdráttur',
  FRAUD: 'Fjársvik',
  LOOTING: 'Gripdeild',
  OTHER_CRIMINAL_OFFENSES: 'Hegningarlagabrot önnur',
  DOMESTIC_VIOLENCE: 'Heimilisofbeldi',
  THREAT: 'Hótun',
  BREAKING_AND_ENTERING: 'Húsbrot',
  COVER_UP: 'Hylming',
  SEXUAL_OFFENSES_OTHER_THAN_RAPE: 'Kynferðisbrot önnur en nauðgun',
  MAJOR_ASSAULT: 'Líkamsárás - meiriháttar',
  MINOR_ASSAULT: 'Líkamsárás - minniháttar',
  AGGRAVATED_ASSAULT: 'Líkamsárás - sérlega hættuleg',
  ASSAULT_LEADING_TO_DEATH: 'Líkamsárás sem leiðir til dauða',
  MURDER: 'Manndráp',
  RAPE: 'Nauðgun',
  UTILITY_THEFT: 'Nytjastuldur',
  MONEY_LAUNDERING: 'Peningaþvætti',
  OTHER_OFFENSES: 'Sérrefsilagabrot önnur',
  NAVAL_LAW_VIOLATION: 'Siglingalagabrot',
  TAX_VIOLATION: 'Skattalagabrot',
  ATTEMPTED_MURDER: 'Tilraun til manndráps',
  CUSTOMS_VIOLATION: 'Tollalagabrot',
  TRAFFIC_VIOLATION: 'Umferðarlagabrot',
  WEPONS_VIOLATION: 'Vopnalagabrot',
  THEFT: 'Þjófnaður',
  // 'Afhending gagna',
  // 'Afturköllun á skipun verjanda',
  OTHER: 'Annað',
  TRACKING_EQUIPMENT: 'Eftirfararbúnaður',
  TRAVEL_BAN: ['Farbann', 'Framlenging farbanns'],
  // 'Framlenging frests',
  // 'Framsalsmál',
  // 'Frestur',
  CUSTODY: ['Gæsluvarðhald', 'Framlenging gæsluvarðhalds'],
  ADMISSION_TO_FACILITY: 'Vistun á viðeigandi stofnun',
  PSYCHIATRIC_EXAMINATION: 'Geðrannsókn',
  // 'Handtaka',
  SOUND_RECORDING_EQUIPMENT: 'Hljóðupptökubúnaði komið fyrir',
  SEARCH_WARRANT: 'Húsleit',
  AUTOPSY: 'Krufning',
  // 'Lausn út öryggisgæslu',
  BODY_SEARCH: 'Leit og líkamsrannsókn',
  // 'Lögmæti rannsóknarathafna',
  RESTRAINING_ORDER: 'Nálgunarbann',
  RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME: 'Nálgunarbann', // this mapping to Nálgunarbann is indented
  EXPULSION_FROM_HOME: 'Nálgunarbann og brottvísun af heimili',
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

  private mask(value: string): string {
    const valueIsFileName = value.split('.').pop() !== value
    const fileNameEnding = valueIsFileName ? value.split('.').pop() : ''
    const valueWithoutFileExtension = valueIsFileName
      ? value.replace(`.${fileNameEnding}`, '')
      : value

    const firstLetterInValue = valueWithoutFileExtension[0]
    const mask = '*'.repeat(valueWithoutFileExtension.length - 2) // -2 to keep the first and last letter of the file name
    const lastLetterInValueWithoutFileExtension =
      valueWithoutFileExtension[valueWithoutFileExtension.length - 1]

    return `${firstLetterInValue}${mask}${lastLetterInValueWithoutFileExtension}${
      valueIsFileName ? `.${fileNameEnding}` : ''
    }`
  }

  async createDocument(
    caseId: string,
    courtId = '',
    courtCaseNumber = '',
    caseFolder: CourtDocumentFolder,
    subject: string,
    fileName: string,
    fileType: string,
    content: Buffer,
    user?: User,
  ): Promise<string> {
    return this.courtClientService
      .uploadStream(courtId, {
        value: content,
        options: { filename: fileName, contentType: fileType },
      })
      .then((streamId) =>
        this.courtClientService.createDocument(courtId, {
          caseNumber: courtCaseNumber,
          subject,
          fileName,
          streamID: streamId,
          caseFolder,
        }),
      )
      .catch((reason) => {
        this.eventService.postErrorEvent(
          'Failed to create a document at court',
          {
            caseId,
            actor: user?.name ?? 'RVG',
            institution: user?.institution?.name ?? 'RVG',
            courtId,
            courtCaseNumber,
            subject: this.mask(subject),
            fileName: this.mask(fileName),
            fileType,
            caseFolder,
          },
          reason,
        )

        throw reason
      })
  }

  async createCourtCase(
    user: User,
    caseId: string,
    courtId = '',
    type: CaseType,
    policeCaseNumbers: string[],
    isExtension: boolean,
    indictmentSubType?: IndictmentSubType,
  ): Promise<string> {
    try {
      const isIndictment = isIndictmentCase(type)

      if (isIndictment && !indictmentSubType) {
        throw 'Sub type is required for indictments'
      }

      // At this point we know that we have a valid sub type
      const subType = (isIndictment ? indictmentSubType : type) as SubType

      let courtSubType = courtSubTypes[subType]

      if (Array.isArray(courtSubType)) {
        courtSubType = courtSubType[isExtension ? 1 : 0]
      }

      return this.courtClientService.createCase(courtId, {
        caseType: isIndictment ? 'S - Ákærumál' : 'R - Rannsóknarmál',
        subtype: courtSubType as string,
        status: 'Skráð',
        receivalDate: formatISO(nowFactory(), { representation: 'date' }),
        basedOn: isIndictment ? 'Sakamál' : 'Rannsóknarhagsmunir',
        // TODO: pass in all policeCaseNumbers when CourtService supports it
        sourceNumber: policeCaseNumbers[0] ? policeCaseNumbers[0] : '',
      })
    } catch (reason) {
      this.eventService.postErrorEvent(
        'Failed to create a court case',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          courtId,
          type,
          policeCaseNumbers: policeCaseNumbers.join(', '),
          isExtension,
        },
        reason,
      )

      throw reason
    }
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
            subject: this.mask(subject),
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
