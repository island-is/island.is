import formatISO from 'date-fns/formatISO'
import { Base64 } from 'js-base64'
import { ConfidentialClientApplication } from '@azure/msal-node'

import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { EmailService } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { sanitize } from '@island.is/judicial-system/formatters'
import type {
  User,
  UserDescriptor,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseFileCategory,
  CaseType,
  IndictmentSubtype,
  IndictmentSubtypeMap,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { EventService } from '../event'
import { RobotLog } from '../repository'
import { courtModuleConfig } from './court.config'

export enum CourtDocumentFolder {
  REQUEST_DOCUMENTS = 'Krafa og greinargerð',
  INDICTMENT_DOCUMENTS = 'Ákæra og greinargerð',
  CASE_DOCUMENTS = 'Gögn málsins',
  COURT_DOCUMENTS = 'Dómar, úrskurðir og Þingbók',
  APPEAL_DOCUMENTS = 'Kæra til Landsréttar',
  SUBPOENA_DOCUMENTS = 'Boðanir',
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
  ANIMAL_PROTECTION: 'Brot á lögum um dýravernd',
  FOREIGN_NATIONALS: 'Brot á lögum um útlendinga',
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
  MEDICINES_OFFENSE: 'Lyfjalög',
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
  RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME: 'Nálgunarbann', // this mapping to Nálgunarbann is intended
  EXPULSION_FROM_HOME: 'Nálgunarbann og brottvísun af heimili',
  // 'Réttarstaða afplánunarfanga',
  // 'Réttarstaða gæsluvarðhaldsfanga',
  PAROLE_REVOCATION: 'Rof á reynslulausn',
  BANKING_SECRECY_WAIVER: 'Rof bankaleyndar',
  // 'Sekt vitnis',
  // 'Sektir málflytjenda',
  PHONE_TAPPING: 'Símhlerun',
  // 'Skýrslutaka brotaþola eldri en 18 ára',
  STATEMENT_FROM_MINOR: 'Skýrslutaka brotaþola yngri en 18 ára',
  STATEMENT_IN_COURT: 'Skýrslutaka fyrir dómi',
  TELECOMMUNICATIONS: 'Upplýsingar um fjarskiptasamskipti',
  INTERNET_USAGE: 'Upplýsingar um vefnotkun',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION: 'Rannsókn á rafrænum gögnum',
  // TODO: replace with appropriate type when it has been created in the court system
  VIDEO_RECORDING_EQUIPMENT: 'Annað',
  // The following are no longer used but left here for historical data integrity
  BODILY_INJURY: 'Hegningarlagabrot önnur',
}

enum RobotEmailType {
  CASE_CONCLUSION = 'CASE_CONCLUSION',
  APPEAL_CASE_RECEIVED_DATE = 'APPEAL_CASE_RECEIVED_DATE',
  APPEAL_CASE_ASSIGNED_ROLES = 'APPEAL_CASE_ASSIGNED_ROLES',
  APPEAL_CASE_CONCLUSION = 'APPEAL_CASE_CONCLUSION',
  APPEAL_CASE_FILE = 'APPEAL_CASE_FILE',
  NEW_INDICTMENT_INFO = 'INDICTMENT_INFO',
  INDICTMENT_CASE_ASSIGNED_ROLES = 'INDICTMENT_CASE_ASSIGNED_ROLES',
  INDICTMENT_CASE_ARRAIGNMENT_DATE = 'INDICTMENT_CASE_ARRAIGNMENT_DATE',
  INDICTMENT_CASE_DEFENDER_INFO = 'INDICTMENT_CASE_DEFENDER_INFO',
  INDICTMENT_CASE_CANCELLATION_NOTICE = 'INDICTMENT_CASE_CANCELLATION_NOTICE',
}

@Injectable()
export class CourtService {
  private confidentintialClientApplication?: ConfidentialClientApplication

  constructor(
    private readonly courtClientService: CourtClientService,
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    @InjectModel(RobotLog) private readonly robotLogModel: typeof RobotLog,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(courtModuleConfig.KEY)
    private readonly config: ConfigType<typeof courtModuleConfig>,
  ) {
    if (config.useMicrosoftGraphApiForCourtRobot) {
      if (
        config.courtRobotClientId &&
        config.courtRobotTenantId &&
        config.courtRobotUser &&
        config.courtRobotClientSecret
      ) {
        this.confidentintialClientApplication =
          new ConfidentialClientApplication({
            auth: {
              clientId: config.courtRobotClientId,
              authority: `https://login.microsoftonline.com/${config.courtRobotTenantId}`,
              clientSecret: config.courtRobotClientSecret,
            },
          })
      } else {
        this.logger.error(
          'Missing required configuration for Microsoft Graph API',
        )
      }
    }
  }

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
    receivalDate: Date,
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
      const policeCaseNumber = policeCaseNumbers[0]
        ? policeCaseNumbers[0].replace(/-/g, '')
        : ''

      return await this.courtClientService.createCase(courtId, {
        caseType: isIndictment ? 'S - Ákærumál' : 'R - Rannsóknarmál',
        // TODO: send a list of subtypes when CourtService supports it
        subtype: courtSubtype as string,
        status: 'Skráð',
        receivalDate: formatISO(receivalDate, { representation: 'date' }),
        basedOn: isIndictment ? 'Sakamál' : 'Rannsóknarhagsmunir',
        // TODO: pass in all policeCaseNumbers when CourtService supports it
        sourceNumber: policeCaseNumber,
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
    user: UserDescriptor,
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

        // Temporarily disabled because of a bug in court system communication
        // this.eventService.postErrorEvent(
        //   'Failed to create an email at court',
        //   {
        //     caseId,
        //     actor: user.name,
        //     institution: user.institution?.name,
        //     courtId,
        //     courtCaseNumber,
        //     subject: this.mask(subject),
        //     recipients,
        //     fromEmail,
        //     fromName,
        //   },
        //   reason,
        // )

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
          'Failed to update court case with prosecutor',
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
          .replace(
            /defendant with IdNumber = \d{10}/g,
            'defendant with IdNumber = **********',
          )

        this.eventService.postErrorEvent(
          'Failed to update court case with defendant',
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

  updateCaseWithConclusion(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    isCorrection?: boolean,
    decision?: CaseDecision,
    rulingDate?: Date,
    validToDate?: Date,
    isolationToDate?: Date,
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - lyktir`
      const content = JSON.stringify({
        isCorrection,
        courtCaseNumber,
        decision,
        rulingDate,
        validToDate,
        isolationToDate,
      })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.CASE_CONCLUSION,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update court case with conclusion',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          isCorrection,
          courtName,
          courtCaseNumber,
          decision,
          rulingDate,
          validToDate,
          isolationToDate,
        },
        error,
      )

      throw error
    }
  }

  updateIndictmentCaseWithIndictmentInfo(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    receivedByCourtDate?: Date,
    indictmentDate?: Date,
    policeCaseNumber?: string,
    subtypes?: string[],
    defendants?: { name?: string; nationalId?: string }[],
    prosecutor?: { name?: string; nationalId?: string; email?: string },
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - upplýsingar`

      policeCaseNumber = policeCaseNumber?.replace(/-/g, '')

      const content = JSON.stringify({
        receivedByCourtDate,
        indictmentDate,
        policeCaseNumber,
        subtypes,
        defendants,
        prosecutor,
      })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.NEW_INDICTMENT_INFO,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update indictment case with indictment info',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          courtCaseNumber,
          receivedByCourtDate,
          indictmentDate,
          policeCaseNumber,
        },
        error,
      )

      throw error
    }
  }

  updateIndictmentCaseWithDefenderInfo(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    defendantNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - verjandi varnaraðila`
      const content = JSON.stringify({
        nationalId: defendantNationalId,
        defenderName,
        defenderEmail,
      })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.INDICTMENT_CASE_DEFENDER_INFO,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update indictment case with defender info',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          courtCaseNumber,
        },
        error,
      )

      throw error
    }
  }

  updateIndictmentCaseWithAssignedRoles(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    assignedRole?: { name?: string; role?: UserRole },
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - úthlutun`
      const content = JSON.stringify(assignedRole)

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.INDICTMENT_CASE_ASSIGNED_ROLES,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update indictment case with assigned roles',
        {
          caseId,
          actor: user.name,
          courtCaseNumber,
        },
        error,
      )

      throw error
    }
  }

  updateIndictmentCaseWithArraignmentDate(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    arraignmentDate?: Date,
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - þingfesting`
      const content = JSON.stringify({ arraignmentDate })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.INDICTMENT_CASE_ARRAIGNMENT_DATE,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update indictment case with arraignment date',
        {
          caseId,
          actor: user.name,
          courtCaseNumber,
        },
        error,
      )

      throw error
    }
  }

  updateIndictmentCaseWithCancellationNotice(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    noticeSubject?: string,
    noticeText?: string,
  ): Promise<unknown> {
    const subject = `${courtName} - ${courtCaseNumber} - afturköllun`
    const content = JSON.stringify({
      subject: noticeSubject,
      text: noticeText,
    })

    return this.sendToRobot(
      subject,
      content,
      RobotEmailType.INDICTMENT_CASE_CANCELLATION_NOTICE,
      caseId,
    )
  }

  updateAppealCaseWithReceivedDate(
    user: User,
    caseId: string,
    appealCaseNumber?: string,
    appealReceivedByCourtDate?: Date,
  ): Promise<unknown> {
    try {
      const subject = `Landsréttur - ${appealCaseNumber} - móttaka`
      const content = JSON.stringify({ appealReceivedByCourtDate })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.APPEAL_CASE_RECEIVED_DATE,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update appeal case with received date',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          appealCaseNumber,
          appealReceivedByCourtDate,
        },
        error,
      )

      throw error
    }
  }

  updateAppealCaseWithAssignedRoles(
    user: User,
    caseId: string,
    appealCaseNumber?: string,
    appealAssistantNationalId?: string,
    appealAssistantName?: string,
    appealJudge1NationalId?: string,
    appealJudge1Name?: string,
    appealJudge2NationalId?: string,
    appealJudge2Name?: string,
    appealJudge3NationalId?: string,
    appealJudge3Name?: string,
  ): Promise<unknown> {
    try {
      const subject = `Landsréttur - ${appealCaseNumber} - aðilar`
      const content = JSON.stringify({
        appealAssistantNationalId,
        appealAssistantName,
        appealJudge1NationalId,
        appealJudge1Name,
        appealJudge2NationalId,
        appealJudge2Name,
        appealJudge3NationalId,
        appealJudge3Name,
      })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.APPEAL_CASE_ASSIGNED_ROLES,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update appeal case with assigned roles',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          appealCaseNumber,
          appealAssistantNationalId,
          appealAssistantName,
          appealJudge1NationalId,
          appealJudge1Name,
          appealJudge2NationalId,
          appealJudge2Name,
          appealJudge3NationalId,
          appealJudge3Name,
        },
        error,
      )

      throw error
    }
  }

  updateAppealCaseWithConclusion(
    user: User,
    caseId: string,
    appealCaseNumber?: string,
    isCorrection?: boolean,
    appealRulingDecision?: CaseAppealRulingDecision,
    appealRulingDate?: Date,
  ): Promise<unknown> {
    try {
      const subject = `Landsréttur - ${appealCaseNumber} - lyktir`
      const content = JSON.stringify({
        isCorrection,
        appealRulingDecision,
        appealRulingDate,
      })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.APPEAL_CASE_CONCLUSION,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update appeal case with conclusion',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          appealCaseNumber,
          isCorrection,
          appealRulingDecision,
          appealRulingDate,
        },
        error,
      )

      throw error
    }
  }

  updateAppealCaseWithFile(
    user: User,
    caseId: string,
    fileId: string,
    appealCaseNumber?: string,
    category?: CaseFileCategory,
    name?: string,
    url?: string,
    dateSent?: Date,
  ): Promise<unknown> {
    try {
      const subject = `Landsréttur - ${appealCaseNumber} - skjal`
      const content = JSON.stringify({
        category,
        name,
        dateSent,
        url: url && Base64.encode(url),
      })

      return this.sendToRobot(
        subject,
        content,
        RobotEmailType.APPEAL_CASE_FILE,
        caseId,
        fileId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update appeal case with file',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          appealCaseNumber,
          category,
          name,
          url,
          dateSent,
        },
        error,
      )

      throw error
    }
  }

  private async createRobotLog(
    type: RobotEmailType,
    caseId: string,
    elementId?: string,
  ) {
    return this.robotLogModel
      .create({ type, caseId, elementId })
      .then((log) => [log.id, log.seqNumber])
  }

  private async sendToRobot(
    subject: string,
    content: string,
    type: RobotEmailType,
    caseId: string,
    elementId?: string,
  ) {
    const [logId, nextval] = await this.createRobotLog(type, caseId, elementId)
    const subjectWithNumber = `${subject} - ${nextval}`

    if (this.config.useMicrosoftGraphApiForCourtRobot) {
      if (!this.confidentintialClientApplication) {
        throw new ServiceUnavailableException(
          'Microsoft Graph API not configured',
        )
      }

      return this.confidentintialClientApplication
        .acquireTokenByClientCredential({
          scopes: ['https://graph.microsoft.com/.default'],
        })
        .then((response) => {
          if (!response) {
            throw new Error('Failed to acquire token')
          }

          return fetch(
            `https://graph.microsoft.com/v1.0/users/${this.config.courtRobotUser}/sendMail`,
            {
              method: 'POST',
              body: JSON.stringify({
                message: {
                  toRecipients: [
                    {
                      emailAddress: {
                        address: this.config.courtRobotEmail,
                        name: this.config.courtRobotName,
                      },
                    },
                  ],
                  subject: subjectWithNumber,
                  body: {
                    contentType: 'Text',
                    content,
                  },
                },
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${response.accessToken}`,
              },
            },
          )
        })
        .then(() =>
          this.robotLogModel.update(
            { delivered: true },
            { where: { id: logId } },
          ),
        )
    }

    return this.emailService
      .sendEmail({
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
        subject: subjectWithNumber,
        text: content,
      })
      .then(() =>
        this.robotLogModel.update(
          { delivered: true },
          { where: { id: logId } },
        ),
      )
  }
}
