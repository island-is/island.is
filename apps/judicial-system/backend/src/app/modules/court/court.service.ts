import formatISO from 'date-fns/formatISO'
import { Base64 } from 'js-base64'
import { ConfidentialClientApplication } from '@azure/msal-node'

import {
  Inject,
  Injectable,
  PayloadTooLargeException,
  ServiceUnavailableException,
} from '@nestjs/common'

import { EmailService } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { sanitize } from '@island.is/judicial-system/formatters'
import type {
  Subtype,
  User,
  UserDescriptor,
} from '@island.is/judicial-system/types'
import {
  AppealCaseRulingDecision,
  CaseDecision,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseType,
  courtSubtypes,
  IndictmentSubtypeMap,
  isIndictmentCase,
  UserRole,
} from '@island.is/judicial-system/types'

import { EventService } from '../event'
import {
  CaseRepositoryService,
  RobotLogRepositoryService,
  User as UserModel,
} from '../repository'
import { courtModuleConfig } from './court.config'

export enum CourtDocumentFolder {
  REQUEST_DOCUMENTS = 'Krafa og greinargerð',
  INDICTMENT_DOCUMENTS = 'Ákæra og greinargerð',
  CASE_DOCUMENTS = 'Gögn málsins',
  COURT_DOCUMENTS = 'Dómar, úrskurðir og Þingbók',
  APPEAL_DOCUMENTS = 'Kæra til Landsréttar',
  SUBPOENA_DOCUMENTS = 'Boðanir',
  WORKING_DOCUMENTS = 'Vinnugögn',
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
  INDICTMENT_CASE_CONCLUSION = 'INDICTMENT_CASE_CONCLUSION',
  INDICTMENT_CASE_SPOKESPERSON_INFO = 'INDICTMENT_CASE_SPOKESPERSON_INFO',
  REQUEST_CASE_DEFENDER_INFO = 'REQUEST_CASE_DEFENDER_INFO',
}

const INDICTMENT_JUDGE_ASSIGNMENT_ROLES = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.COURT_OF_APPEALS_JUDGE,
]

@Injectable()
export class CourtService {
  private confidentintialClientApplication?: ConfidentialClientApplication

  constructor(
    private readonly courtClientService: CourtClientService,
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly robotLogRepositoryService: RobotLogRepositoryService,
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

    // The first and last letter are always kept, so there is nothing left to
    // mask in shorter values
    if (valueWithoutFileExtension.length < 2) {
      return value
    }

    const firstLetterInValue = valueWithoutFileExtension[0]
    const mask = '*'.repeat(valueWithoutFileExtension.length - 2) // -2 to keep the first and last letter of the file name
    const lastLetterInValueWithoutFileExtension =
      valueWithoutFileExtension[valueWithoutFileExtension.length - 1]

    return `${firstLetterInValue}${mask}${lastLetterInValueWithoutFileExtension}${
      valueIsFileName ? `.${fileNameEnding}` : ''
    }`
  }

  // The court service rejects files that exceed its size limit and no amount of
  // retrying will change that, so the court is asked to upload the file by hand.
  private async notifyCourtOfFileTooLarge(
    caseId: string,
    courtId: string,
    courtCaseNumber: string,
    fileName: string,
  ): Promise<void> {
    let theCase: Awaited<ReturnType<CaseRepositoryService['findById']>> = null

    try {
      theCase = await this.caseRepositoryService.findById(caseId, {
        include: [
          { model: UserModel, as: 'judge' },
          { model: UserModel, as: 'registrar' },
        ],
      })
    } catch (reason) {
      this.logger.error(
        `Failed to look up case ${caseId} when notifying that a file was too large for the court service`,
        { reason },
      )
    }

    const recipients: { name: string; address: string }[] = []

    const courtEmail = this.config.courtsEmails[courtId]

    if (courtEmail) {
      recipients.push({ name: '', address: courtEmail })
    }

    if (theCase?.judge?.email) {
      recipients.push({
        name: theCase.judge.name,
        address: theCase.judge.email,
      })
    }

    if (theCase?.registrar?.email) {
      recipients.push({
        name: theCase.registrar.name,
        address: theCase.registrar.email,
      })
    }

    const uniqueRecipients = recipients.filter(
      (recipient, index, all) =>
        all.findIndex((r) => r.address === recipient.address) === index,
    )

    if (uniqueRecipients.length === 0) {
      this.logger.error(
        `No email recipients are available for court ${courtId}, so it cannot be notified that a file was too large for the court service`,
      )

      return
    }

    const body = `Ekki tókst að hlaða upp skjali ${this.mask(
      fileName,
    )} í Auði vegna stærðartakmarkana. Vinsamlegast hlaðið skjali upp handvirkt í Auði.`

    const subject = `Ekki tókst að hlaða upp skjali í Auði í máli ${courtCaseNumber}`

    await Promise.all(
      uniqueRecipients.map(async (recipient) => {
        try {
          await this.emailService.sendEmail({
            from: {
              name: this.config.fromName,
              address: this.config.fromEmail,
            },
            replyTo: {
              name: this.config.replyToName,
              address: this.config.replyToEmail,
            },
            to: [recipient],
            subject,
            text: body,
            html: body,
          })
        } catch (reason) {
          this.logger.error(
            `Failed to notify ${recipient.address} that a file was too large for the court service`,
            { reason },
          )
        }
      }),
    )
  }

  private validateCourtRobotEmailParams(
    courtName?: string,
    courtCaseNumber?: string,
  ): void {
    if (!courtName || !courtCaseNumber) {
      throw new Error('Missing court name or court case number')
    }
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

    try {
      const streamId = await this.courtClientService.uploadStream(courtId, {
        value: content,
        options: { filename: sanitizedFileName, contentType: fileType },
      })

      return await this.courtClientService.createDocument(courtId, {
        caseNumber: courtCaseNumber,
        subject,
        fileName: sanitizedFileName,
        streamID: streamId,
        caseFolder,
      })
    } catch (reason) {
      if (reason instanceof ServiceUnavailableException) {
        // Act as if the document was created successfully
        return ''
      }

      if (reason instanceof PayloadTooLargeException) {
        await this.notifyCourtOfFileTooLarge(
          caseId,
          courtId,
          courtCaseNumber,
          sanitizedFileName,
        )
      } else {
        this.eventService.postErrorEvent(
          'Failed to create a document at court',
          {
            caseId,
            actor: user.name,
            institution: user.institution?.name,
            courtId,
            courtCaseNumber,
            subject: this.mask(subject),
            fileName: this.mask(sanitizedFileName),
            fileType,
            caseFolder,
          },
          reason,
        )
      }

      throw reason
    }
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
    try {
      const streamId = await this.courtClientService.uploadStream(courtId, {
        value: content,
        options: { filename: fileName, contentType: fileType },
      })

      return await this.courtClientService.createThingbok(courtId, {
        caseNumber: courtCaseNumber,
        subject,
        fileName,
        streamID: streamId,
      })
    } catch (reason) {
      if (reason instanceof ServiceUnavailableException) {
        // Act as if the document was created successfully
        return ''
      }

      if (reason instanceof PayloadTooLargeException) {
        await this.notifyCourtOfFileTooLarge(
          caseId,
          courtId,
          courtCaseNumber,
          fileName,
        )
      } else {
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
      }

      throw reason
    }
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
    user: UserDescriptor | undefined,
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
          'Failed to create an email at court',
          {
            caseId,
            actor: user?.name,
            institution: user?.institution?.name,
            courtId,
            courtCaseNumber,
            subject: this.mask(subject),
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

  async updateCaseWithConclusion(
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

      return await this.sendToRobot(
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

  async updateIndictmentCaseWithIndictmentInfo(
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

      return await this.sendToRobot(
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

  async updateIndictmentCaseWithDefenderInfo(
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

      return await this.sendToRobot(
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

  async updateIndictmentCaseWithSpokespersonInfo(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    civilClaimantNationalId?: string,
    civilClaimantName?: string,
    spokespersonNationalId?: string,
    spokespersonIsLawyer?: boolean,
  ): Promise<unknown> {
    try {
      this.validateCourtRobotEmailParams(courtName, courtCaseNumber)

      const subjectSuffix = spokespersonNationalId
        ? spokespersonIsLawyer
          ? 'lögmaður brotaþola'
          : 'réttargæslumaður brotaþola'
        : 'brotaþoli'
      const subject = `${courtName} - ${courtCaseNumber} - ${subjectSuffix}`
      const content = JSON.stringify({
        civilClaimantNationalId,
        civilClaimantName,
        spokespersonNationalId,
        spokespersonIsLawyer,
      })

      return await this.sendToRobot(
        subject,
        content,
        RobotEmailType.INDICTMENT_CASE_SPOKESPERSON_INFO,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update indictment case with spokesperson info',
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

  async updateRequestCaseWithDefenderInfo(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    defendantNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
  ): Promise<unknown> {
    try {
      this.validateCourtRobotEmailParams(courtName, courtCaseNumber)

      const subject = `${courtName} - ${courtCaseNumber} - verjandi varnaraðila`
      const content = JSON.stringify({
        nationalId: defendantNationalId,
        defenderName,
        defenderEmail,
      })

      return await this.sendToRobot(
        subject,
        content,
        RobotEmailType.REQUEST_CASE_DEFENDER_INFO,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update request case with defender info',
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

  async hasPriorIndictmentJudgeAssignment(caseId: string): Promise<boolean> {
    return await this.robotLogRepositoryService.existsForCaseTypeAndElements(
      caseId,
      RobotEmailType.INDICTMENT_CASE_ASSIGNED_ROLES,
      INDICTMENT_JUDGE_ASSIGNMENT_ROLES,
    )
  }

  async updateIndictmentCaseWithAssignedRoles(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    assignedRole?: { name?: string; role?: UserRole },
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - úthlutun`
      const content = JSON.stringify(assignedRole)

      return await this.sendToRobot(
        subject,
        content,
        RobotEmailType.INDICTMENT_CASE_ASSIGNED_ROLES,
        caseId,
        assignedRole?.role,
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

  async updateIndictmentCaseWithArraignmentDate(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    arraignmentDate?: Date,
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - þingfesting`
      const content = JSON.stringify({ arraignmentDate })

      return await this.sendToRobot(
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

  async updateIndictmentCaseWithCancellationNotice(
    user: User,
    caseId: string,
    courtName?: string,
    courtCaseNumber?: string,
    noticeSubject?: string,
    noticeText?: string,
  ): Promise<unknown> {
    try {
      const subject = `${courtName} - ${courtCaseNumber} - afturköllun`
      const content = JSON.stringify({
        subject: noticeSubject,
        text: noticeText,
      })

      return await this.sendToRobot(
        subject,
        content,
        RobotEmailType.INDICTMENT_CASE_CANCELLATION_NOTICE,
        caseId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update indictment case with cancellation notice',
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

  async updateIndictmentCaseWithConclusion(
    user: User,
    caseId: string,
    courtName: string,
    courtCaseNumber: string,
    content: Record<string, unknown>,
    elementId?: string,
  ): Promise<unknown> {
    try {
      this.validateCourtRobotEmailParams(courtName, courtCaseNumber)

      const subject = `${courtName} - ${courtCaseNumber} - lyktir`

      return await this.sendToRobot(
        subject,
        JSON.stringify(content),
        RobotEmailType.INDICTMENT_CASE_CONCLUSION,
        caseId,
        elementId,
      )
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to update indictment case with conclusion',
        {
          caseId,
          actor: user.name,
          institution: user.institution?.name,
          courtName,
          courtCaseNumber,
          content: JSON.stringify(content),
        },
        error,
      )

      throw error
    }
  }

  async updateAppealCaseWithReceivedDate(
    user: User,
    caseId: string,
    appealCaseNumber?: string,
    appealReceivedByCourtDate?: Date,
  ): Promise<unknown> {
    try {
      const subject = `Landsréttur - ${appealCaseNumber} - móttaka`
      const content = JSON.stringify({ appealReceivedByCourtDate })

      return await this.sendToRobot(
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

  async updateAppealCaseWithAssignedRoles(
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

      return await this.sendToRobot(
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

  async updateAppealCaseWithConclusion(
    user: User,
    caseId: string,
    appealCaseNumber?: string,
    isCorrection?: boolean,
    appealRulingDecision?: AppealCaseRulingDecision,
    appealRulingDate?: Date,
  ): Promise<unknown> {
    try {
      const subject = `Landsréttur - ${appealCaseNumber} - lyktir`
      const content = JSON.stringify({
        isCorrection,
        appealRulingDecision,
        appealRulingDate,
      })

      return await this.sendToRobot(
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

  async updateAppealCaseWithFile(
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

      return await this.sendToRobot(
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

  private async sendToRobot(
    subject: string,
    content: string,
    type: RobotEmailType,
    caseId: string,
    elementId?: string,
  ) {
    const { id: logId, seqNumber } =
      await this.robotLogRepositoryService.create({ type, caseId, elementId })
    const subjectWithNumber = `${subject} - ${seqNumber}`

    if (this.config.useMicrosoftGraphApiForCourtRobot) {
      if (!this.confidentintialClientApplication) {
        throw new ServiceUnavailableException(
          'Microsoft Graph API not configured',
        )
      }

      const tokenResponse =
        await this.confidentintialClientApplication.acquireTokenByClientCredential(
          { scopes: ['https://graph.microsoft.com/.default'] },
        )

      if (!tokenResponse?.accessToken) {
        throw new Error('Failed to acquire token')
      }

      const sendMailResponse = await fetch(
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
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        },
      )

      // fetch resolves for error statuses, so the robot log would otherwise be
      // marked delivered for a mail the Graph API rejected
      if (!sendMailResponse.ok) {
        throw new Error(
          `Failed to send robot email through the Microsoft Graph API: ${sendMailResponse.status} ${sendMailResponse.statusText}`,
        )
      }
    } else {
      await this.emailService.sendEmail({
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
    }

    await this.robotLogRepositoryService.markDelivered(logId)
  }
}

type BuildIndictmentConclusionContentInput = {
  isCorrection?: boolean
  courtCaseNumber: string
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate: Date | string
  wasAssignedToJudge?: boolean
  judgeNationalId?: string
  mergeCaseNumber?: string
  defendantNationalId?: string
  splitCaseNumber?: string
}

export const buildIndictmentConclusionContent = ({
  isCorrection = false,
  courtCaseNumber,
  indictmentRulingDecision,
  rulingDate,
  wasAssignedToJudge,
  judgeNationalId,
  mergeCaseNumber,
  defendantNationalId,
  splitCaseNumber,
}: BuildIndictmentConclusionContentInput): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    isCorrection,
    courtCaseNumber,
    rulingDate:
      rulingDate instanceof Date ? rulingDate.toISOString() : rulingDate,
  }

  if (splitCaseNumber !== undefined) {
    payload.indictmentRulingDecision = 'SPLIT'
    payload.splitCaseNumber = splitCaseNumber
  } else if (indictmentRulingDecision) {
    payload.indictmentRulingDecision = indictmentRulingDecision

    if (indictmentRulingDecision === CaseIndictmentRulingDecision.WITHDRAWAL) {
      payload.wasAssignedToJudge = Boolean(wasAssignedToJudge)
      if (judgeNationalId) {
        payload.judgeNationalId = judgeNationalId
      }
    }

    if (
      indictmentRulingDecision === CaseIndictmentRulingDecision.MERGE &&
      mergeCaseNumber
    ) {
      // TODO(Evolv): Confirm merge payload with Auði
      payload.mergeCaseNumber = mergeCaseNumber
    }
  }

  if (defendantNationalId) {
    // TODO(Evolv): Confirm per-defendant payload with Auði
    payload.defendantNationalId = defendantNationalId
  }

  return payload
}
