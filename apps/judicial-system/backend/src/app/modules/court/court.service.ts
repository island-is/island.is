import formatISO from 'date-fns/formatISO'

import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common'

import { EmailService } from '@island.is/email-service'
import type { ConfigType } from '@island.is/nest/config'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { sanitize } from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseDecision,
  CaseType,
  IndictmentSubtype,
  IndictmentSubtypeMap,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { EventService } from '../event'
import { courtModuleConfig } from './court.config'

export enum CourtDocumentFolder {
  REQUEST_DOCUMENTS = 'Krafa og greinargerð',
  INDICTMENT_DOCUMENTS = 'Ákæra og greinargerð',
  CASE_DOCUMENTS = 'Gögn málsins',
  COURT_DOCUMENTS = 'Dómar, úrskurðir og Þingbók',
  APPEAL_DOCUMENTS = 'Kæra til Landsréttar',
}

export type Subtype = Exclude<CaseType, CaseType.INDICTMENT> | IndictmentSubtype

type CourtSubtypes = {
  [c in Subtype]: string | [string, string]
}

// Maps case types to subtypes in the court system
export const courtSubtypes: CourtSubtypes = {
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
  PAROLE_REVOCATION: 'Rof á reynslulausn',
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
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    @Inject(courtModuleConfig.KEY)
    private readonly config: ConfigType<typeof courtModuleConfig>,
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

  private getCourtSubtype(
    type: CaseType,
    isExtension: boolean,
    policeCaseNumbers: string[],
    indictmentSubtypes?: IndictmentSubtypeMap,
  ): string {
    let subtype: Subtype

    if (type === CaseType.INDICTMENT) {
      if (
        policeCaseNumbers.length === 0 ||
        !indictmentSubtypes ||
        !indictmentSubtypes[policeCaseNumbers[0]] ||
        indictmentSubtypes[policeCaseNumbers[0]].length === 0
      ) {
        throw 'Subtype is required for indictments'
      }
      // Use the first indictment subtype of the first police case number
      subtype = indictmentSubtypes[policeCaseNumbers[0]][0]
    } else {
      subtype = type
    }

    let courtSubtype = courtSubtypes[subtype]

    if (Array.isArray(courtSubtype)) {
      courtSubtype = courtSubtype[isExtension ? 1 : 0]
    }

    return courtSubtype
  }

  async createDocument(
    user: User,
    caseId: string,
    courtId = '',
    courtCaseNumber = '',
    caseFolder: CourtDocumentFolder,
    subject: string,
    fileName: string,
    fileType: string,
    content: Buffer,
  ): Promise<string> {
    const sanitizedFileName = sanitize(fileName)

    return this.courtClientService
      .uploadStream(courtId, {
        value: content,
        options: { filename: sanitizedFileName, contentType: fileType },
      })
      .then((streamId) =>
        this.courtClientService.createDocument(courtId, {
          caseNumber: courtCaseNumber,
          subject,
          fileName: sanitizedFileName,
          streamID: streamId,
          caseFolder,
        }),
      )
      .catch((reason) => {
        if (reason instanceof ServiceUnavailableException) {
          // Act as if the document was created successfully
          return ''
        }

        this.eventService.postErrorEvent(
          'Failed to create a document at court',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            subject: this.mask(subject),
            fileName: this.mask(sanitize(fileName)),
            fileType,
            caseFolder,
          },
          reason,
        )

        throw reason
      })
  }

  async createCourtRecord(
    user: User,
    caseId: string,
    courtId = '',
    courtCaseNumber = '',
    subject: string,
    fileName: string,
    fileType: string,
    content: Buffer,
  ): Promise<string> {
    return this.courtClientService
      .uploadStream(courtId, {
        value: content,
        options: { filename: fileName, contentType: fileType },
      })
      .then((streamId) =>
        this.courtClientService.createThingbok(courtId, {
          caseNumber: courtCaseNumber,
          subject,
          fileName,
          streamID: streamId,
        }),
      )
      .catch((reason) => {
        if (reason instanceof ServiceUnavailableException) {
          // Act as if the document was created successfully
          return ''
        }

        this.eventService.postErrorEvent(
          'Failed to create a court record at court',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            subject: this.mask(subject),
            fileName: this.mask(fileName),
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
    courtId = '',
    type: CaseType,
    policeCaseNumbers: string[],
    isExtension: boolean,
    indictmentSubtypes?: IndictmentSubtypeMap,
  ): Promise<string> {
    try {
      const courtSubtype = this.getCourtSubtype(
        type,
        isExtension,
        policeCaseNumbers,
        indictmentSubtypes,
      )

      const isIndictment = isIndictmentCase(type)

      return await this.courtClientService.createCase(courtId, {
        caseType: isIndictment ? 'S - Ákærumál' : 'R - Rannsóknarmál',
        subtype: courtSubtype as string,
        status: 'Skráð',
        receivalDate: formatISO(nowFactory(), { representation: 'date' }),
        basedOn: isIndictment ? 'Sakamál' : 'Rannsóknarhagsmunir',
        // TODO: pass in all policeCaseNumbers when CourtService supports it
        sourceNumber: policeCaseNumbers[0] ? policeCaseNumbers[0] : '',
      })
    } catch (reason) {
      if (reason instanceof ServiceUnavailableException) {
        // Act as if the court case was created successfully
        return isIndictmentCase(type) ? 'S-9999/9999' : 'R-9999/9999'
      }

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
        if (reason instanceof ServiceUnavailableException) {
          // Act as if the email was created successfully
          return ''
        }

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

  async updateCaseWithProsecutor(
    user: User,
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    prosecutorNationalId: string,
    prosecutorsOfficeNationalId: string,
  ): Promise<string> {
    return this.courtClientService
      .updateCaseWithProsecutor(courtId, {
        userIdNumber: user.nationalId,
        caseId: courtCaseNumber,
        prosecutor: {
          companyIdNumber: prosecutorsOfficeNationalId,
          prosecutorIdNumber: prosecutorNationalId,
        },
      })
      .catch((reason) => {
        if (reason instanceof ServiceUnavailableException) {
          // Act as if the case was updated successfully
          return ''
        }

        this.eventService.postErrorEvent(
          'Failed to update case with prosecutor',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            prosecutorNationalId,
            prosecutorsOfficeNationalId,
          },
          reason,
        )

        throw reason
      })
  }

  async updateCaseWithDefendant(
    user: User,
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    defendantNationalId: string,
    defenderEmail?: string,
  ): Promise<string> {
    return this.courtClientService
      .updateCaseWithDefendant(courtId, {
        userIdNumber: user.nationalId,
        caseId: courtCaseNumber,
        defendant: {
          idNumber: defendantNationalId,
          lawyerEmail: defenderEmail,
        },
      })
      .catch((reason) => {
        if (reason instanceof ServiceUnavailableException) {
          // Act as if the case was updated successfully
          return ''
        }

        const sanitizedReason = JSON.stringify(reason)
          .replace(
            /Participant with id: \d{10}/g,
            'Participant with id: **********',
          )
          .replace(/\) gegn(.*?)'/g, ') gegn **********')

        this.eventService.postErrorEvent(
          'Failed to update case with defendant',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            defenderEmail,
          },
          JSON.parse(sanitizedReason),
        )

        throw JSON.parse(sanitizedReason)
      })
  }

  async updateCaseWithConclusion(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    decision?: CaseDecision,
    rulingDate?: Date,
    validToDate?: Date,
    isolationToDate?: Date,
  ): Promise<string> {
    return this.emailService.sendEmail({
      from: {
        name: this.config.fromName,
        address: this.config.fromEmail,
      },
      replyTo: {
        name: this.config.replyToName,
        address: this.config.replyToEmail,
      },
      to: [
        {
          name: this.config.courtRobotName,
          address: this.config.courtRobotEmail,
        },
      ],
      subject: `${courtName} ${courtCaseNumber}`,
      text: JSON.stringify({
        courtName,
        courtCaseNumber,
        decision,
        rulingDate,
        validToDate,
        isolationToDate,
      }),
    })
  }
}
