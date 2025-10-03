import { Includeable, Op, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  Message,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseNotificationType,
  CaseOrigin,
  CaseState,
  CaseTransition,
  CaseType,
  CourtDocumentType,
  DateType,
  dateTypes,
  defendantEventTypes,
  EventType,
  eventTypes,
  hasGeneratedCourtRecordPdf,
  isCompletedCase,
  isIndictmentCase,
  isInvestigationCase,
  isRequestCase,
  notificationTypes,
  ServiceStatus,
  StringType,
  stringTypes,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import {
  getCourtRecordPdfAsString,
  getRulingPdfAsString,
} from '../../formatters'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { CourtDocumentService, CourtSessionService } from '../court-session'
import { DefendantService } from '../defendant'
import { EventService } from '../event'
import { EventLogService } from '../event-log'
import { FileService } from '../file'
import { IndictmentCountService } from '../indictment-count'
import {
  Case,
  CaseFile,
  CaseRepositoryService,
  CaseString,
  CivilClaimant,
  CourtDocument,
  CourtSession,
  DateLog,
  Defendant,
  DefendantEventLog,
  EventLog,
  IndictmentCount,
  Institution,
  Notification,
  Offense,
  Subpoena,
  UpdateCase,
  User,
  Verdict,
  Victim,
} from '../repository'
import { SubpoenaService } from '../subpoena'
import { VerdictService } from '../verdict/verdict.service'
import { CreateCaseDto } from './dto/createCase.dto'
import { getCasesQueryFilter } from './filters/cases.filter'
import { MinimalCase } from './models/case.types'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { transitionCase } from './state/case.state'
import { caseModuleConfig } from './case.config'

type DateLogKeys = keyof Pick<UpdateCase, 'arraignmentDate' | 'courtDate'>

const dateLogTypes: Record<DateLogKeys, DateType> = {
  arraignmentDate: DateType.ARRAIGNMENT_DATE,
  courtDate: DateType.COURT_DATE,
}

type CaseStringKeys = keyof Pick<
  UpdateCase,
  'postponedIndefinitelyExplanation' | 'civilDemands'
>

const caseStringTypes: Record<CaseStringKeys, StringType> = {
  postponedIndefinitelyExplanation:
    StringType.POSTPONED_INDEFINITELY_EXPLANATION,
  civilDemands: StringType.CIVIL_DEMANDS,
}

export const include: Includeable[] = [
  { model: Institution, as: 'prosecutorsOffice' },
  { model: Institution, as: 'court' },
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'courtRecordSignatory',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealAssistant',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge1',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge2',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge3',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'indictmentReviewer',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: Case,
    as: 'parentCase',
    include: [
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: { state: { [Op.not]: CaseFileState.DELETED }, category: null },
        separate: true,
      },
    ],
  },
  { model: Case, as: 'childCase' },
  {
    model: Defendant,
    as: 'defendants',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: Subpoena,
        as: 'subpoenas',
        required: false,
        order: [['created', 'DESC']],
        separate: true,
      },
      {
        model: DefendantEventLog,
        as: 'eventLogs',
        required: false,
        where: { eventType: defendantEventTypes },
        separate: true,
      },
      {
        model: Verdict,
        as: 'verdict',
        required: false,
      },
    ],
    separate: true,
  },
  {
    model: CivilClaimant,
    as: 'civilClaimants',
    required: false,
    order: [['created', 'ASC']],
    separate: true,
  },
  { model: Victim, as: 'victims', required: false },
  {
    model: IndictmentCount,
    as: 'indictmentCounts',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: Offense,
        as: 'offenses',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
    ],
    separate: true,
  },
  {
    model: CourtSession,
    as: 'courtSessions',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: User,
        as: 'attestingWitness',
        required: false,
        include: [{ model: Institution, as: 'institution' }],
      },
      {
        model: CourtDocument,
        as: 'filedDocuments',
        required: false,
        order: [['documentOrder', 'ASC']],
        separate: true,
      },
    ],
    separate: true,
  },
  {
    model: CourtDocument,
    as: 'unfiledCourtDocuments',
    required: false,
    order: [
      ['documentOrder', 'DESC'],
      ['created', 'ASC'],
    ],
    where: { courtSessionId: null },
    separate: true,
  },
  {
    model: CaseFile,
    as: 'caseFiles',
    required: false,
    order: [['created', 'DESC']],
    where: { state: { [Op.not]: CaseFileState.DELETED } },
    separate: true,
  },
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    where: { eventType: eventTypes },
    separate: true,
  },
  {
    model: DateLog,
    as: 'dateLogs',
    required: false,
    where: { dateType: dateTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: CaseString,
    as: 'caseStrings',
    required: false,
    where: { stringType: stringTypes },
    separate: true,
  },
  {
    model: Notification,
    as: 'notifications',
    required: false,
    where: { type: notificationTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: Case,
    as: 'mergeCase',
    include: [
      {
        model: CourtSession,
        as: 'courtSessions',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
    ],
  },
  {
    model: Case,
    as: 'mergedCases',
    where: { state: CaseState.COMPLETED },
    include: [
      {
        model: Defendant,
        as: 'defendants',
        required: false,
        order: [['created', 'ASC']],
        include: [
          {
            model: Subpoena,
            as: 'subpoenas',
            required: false,
            order: [['created', 'DESC']],
            separate: true,
          },
          {
            model: Verdict,
            as: 'verdict',
            required: false,
          },
        ],
        separate: true,
      },
      {
        model: CourtSession,
        as: 'courtSessions',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
        include: [
          {
            model: CourtDocument,
            as: 'filedDocuments',
            required: false,
            order: [['documentOrder', 'ASC']],
            separate: true,
          },
        ],
      },
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: {
          state: { [Op.not]: CaseFileState.DELETED },
          category: {
            [Op.in]: [
              CaseFileCategory.COURT_RECORD,
              CaseFileCategory.CRIMINAL_RECORD,
              CaseFileCategory.COST_BREAKDOWN,
              CaseFileCategory.CRIMINAL_RECORD_UPDATE,
              CaseFileCategory.CASE_FILE,
              CaseFileCategory.PROSECUTOR_CASE_FILE,
              CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.DEFENDANT_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIM,
            ],
          },
        },
        separate: true,
      },
      { model: Institution, as: 'court' },
      { model: User, as: 'judge' },
      { model: User, as: 'prosecutor' },
      { model: Institution, as: 'prosecutorsOffice' },
    ],
    separate: true,
  },
]

export const caseListInclude: Includeable[] = [
  { model: Institution, as: 'court' },
  { model: Institution, as: 'prosecutorsOffice' },
  {
    model: Defendant,
    as: 'defendants',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: DefendantEventLog,
        as: 'eventLogs',
        required: false,
        where: { eventType: defendantEventTypes },
        separate: true,
      },
      {
        model: Subpoena,
        as: 'subpoenas',
        required: false,
        order: [['created', 'DESC']],
        separate: true,
      },
      {
        model: Verdict,
        as: 'verdict',
        required: false,
      },
    ],
    separate: true,
  },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'indictmentReviewer',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: DateLog,
    as: 'dateLogs',
    required: false,
    where: { dateType: dateTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: CaseString,
    as: 'caseStrings',
    required: false,
    where: { stringType: stringTypes },
    separate: true,
  },
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    where: { eventType: eventTypes },
    separate: true,
  },
]

@Injectable()
export class CaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(DateLog) private readonly dateLogModel: typeof DateLog,
    @InjectModel(CaseString)
    private readonly caseStringModel: typeof CaseString,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly defendantService: DefendantService,
    private readonly indictmentCountService: IndictmentCountService,
    private readonly courtSessionService: CourtSessionService,
    private readonly courtDocumentService: CourtDocumentService,
    private readonly subpoenaService: SubpoenaService,
    private readonly verdictService: VerdictService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    private readonly eventLogService: EventLogService,
    private readonly messageService: MessageService,
    private readonly caseRepositoryService: CaseRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async uploadSignedRulingPdfToS3(
    theCase: Case,
    pdf: string,
  ): Promise<boolean> {
    return this.awsS3Service
      .putGeneratedRequestCaseObject(
        theCase.type,
        `${theCase.id}/ruling.pdf`,
        pdf,
      )
      .then(() => true)
      .catch((reason) => {
        this.logger.error(
          `Failed to upload signed ruling pdf to AWS S3 for case ${theCase.id}`,
          { reason },
        )

        return false
      })
  }

  private async uploadSignedCourtRecordPdfToS3(
    theCase: Case,
    pdf: string,
  ): Promise<boolean> {
    return this.awsS3Service
      .putGeneratedRequestCaseObject(
        theCase.type,
        `${theCase.id}/courtRecord.pdf`,
        pdf,
      )
      .then(() => true)
      .catch((reason) => {
        this.logger.error(
          `Failed to upload signed court record pdf to AWS S3 for case ${theCase.id}`,
          { reason },
        )

        return false
      })
  }

  private async createCase(
    caseToCreate: CreateCaseDto,
    transaction: Transaction,
  ): Promise<string> {
    const theCase = await this.caseRepositoryService.create(
      {
        ...caseToCreate,
        state: isRequestCase(caseToCreate.type)
          ? CaseState.NEW
          : CaseState.DRAFT,
      },
      { transaction },
    )

    if (isIndictmentCase(theCase.type)) {
      await this.createIndictmentsForNewPoliceCaseNumbers(
        theCase.policeCaseNumbers,
        theCase,
        transaction,
      )
    }

    return theCase.id
  }

  private async handlePoliceCaseNumbersUpdate(
    theCase: Case,
    update: UpdateCase,
    transaction: Transaction,
  ): Promise<void> {
    if (
      !update.policeCaseNumbers ||
      update.policeCaseNumbers.length === 0 ||
      (!theCase.caseFiles && !theCase.indictmentCounts)
    ) {
      // Nothing to do
      return
    }

    const oldPoliceCaseNumbers = [...theCase.policeCaseNumbers].sort()
    const newPoliceCaseNumbers = [...update.policeCaseNumbers].sort()

    const removedPoliceCaseNumbers: string[] = []
    const addedPoliceCaseNumbers: string[] = []

    // Find added and removed police case numbers
    while (oldPoliceCaseNumbers.length > 0 && newPoliceCaseNumbers.length > 0) {
      // If the police case numbers are equal, then nothing has changed
      if (oldPoliceCaseNumbers[0] === newPoliceCaseNumbers[0]) {
        oldPoliceCaseNumbers.shift()
        newPoliceCaseNumbers.shift()

        continue
      }

      // If the first police case number in the old list is smaller
      // than the first in the new list, then it has been removed
      if (oldPoliceCaseNumbers[0] < newPoliceCaseNumbers[0]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        removedPoliceCaseNumbers.push(oldPoliceCaseNumbers.shift()!)

        continue
      }

      // Otherwise, the first police case number in the new list has been added
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addedPoliceCaseNumbers.push(newPoliceCaseNumbers.shift()!)
    }

    // If there are still police case numbers left in either list,
    // then they have been removed or added
    removedPoliceCaseNumbers.push(...oldPoliceCaseNumbers)
    addedPoliceCaseNumbers.push(...newPoliceCaseNumbers)

    // Assumption: If exactly one police case number has been added and
    // exactly one has been removed, then a police case number has been changed
    if (
      removedPoliceCaseNumbers.length === 1 &&
      addedPoliceCaseNumbers.length === 1
    ) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const removedPoliceCaseNumber = removedPoliceCaseNumbers.shift()!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const addedPoliceCaseNumber = addedPoliceCaseNumbers.shift()!

      if (theCase.caseFiles) {
        // Update case files with the new police case number
        for (const caseFile of theCase.caseFiles.filter(
          (caseFile) => caseFile.policeCaseNumber === removedPoliceCaseNumber,
        )) {
          await this.fileService.updateCaseFile(
            theCase.id,
            caseFile.id,
            { policeCaseNumber: addedPoliceCaseNumber },
            transaction,
          )
        }
      }

      if (theCase.indictmentCounts) {
        // Update indictment counts with the new police case number
        for (const indictmentCount of theCase.indictmentCounts.filter(
          (indictmentCount) =>
            indictmentCount.policeCaseNumber === removedPoliceCaseNumber,
        )) {
          await this.indictmentCountService.update(
            theCase.id,
            indictmentCount.id,
            { policeCaseNumber: addedPoliceCaseNumber },
            transaction,
          )
        }
      }

      // We are done
      return
    }

    if (theCase.caseFiles) {
      // Delete case files connected to removed police case numbers
      for (const caseFile of theCase.caseFiles.filter(
        (caseFile) =>
          caseFile.policeCaseNumber &&
          removedPoliceCaseNumbers.includes(caseFile.policeCaseNumber),
      )) {
        await this.fileService.deleteCaseFile(theCase, caseFile, transaction)
      }
    }

    if (theCase.indictmentCounts) {
      // Delete indictment counts connected to removed police case numbers
      for (const indictmentCount of theCase.indictmentCounts.filter(
        (indictmentCount) =>
          indictmentCount.policeCaseNumber &&
          removedPoliceCaseNumbers.includes(indictmentCount.policeCaseNumber),
      )) {
        await this.indictmentCountService.delete(
          theCase.id,
          indictmentCount.id,
          transaction,
        )
      }
    }

    // Add a single indictment count for each added police case numbers
    if (isIndictmentCase(theCase.type)) {
      await this.createIndictmentsForNewPoliceCaseNumbers(
        addedPoliceCaseNumbers,
        theCase,
        transaction,
      )
    }
  }

  private async createIndictmentsForNewPoliceCaseNumbers(
    newPoliceCaseNumbers: string[],
    theCase: Case,
    transaction: Transaction,
  ) {
    for (const policeCaseNumber of newPoliceCaseNumbers) {
      await this.indictmentCountService.createWithPoliceCaseNumber(
        theCase.id,
        policeCaseNumber,
        transaction,
      )
    }
  }

  private getDeliverDefendantToCourtMessages(
    theCase: Case,
    user: TUser,
  ): Message[] {
    const messages =
      theCase.defendants?.map((defendant) => ({
        type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
        user,
        caseId: theCase.id,
        elementId: defendant.id,
      })) ?? []

    return messages
  }

  private getDeliverProsecutorToCourtMessages(
    theCase: Case,
    user: TUser,
  ): Message[] {
    const messages = [
      {
        type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
        user,
        caseId: theCase.id,
      },
    ]

    return messages
  }

  private getDeliverAssignedRolesToCourtOfAppealsMessages(
    user: TUser,
    theCase: Case,
  ): Message[] {
    return [
      {
        type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
        user,
        caseId: theCase.id,
      },
    ]
  }

  private addMessagesForSubmittedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.READY_FOR_COURT },
      },
    ])
  }

  private addMessagesForDistrictCourtJudgeAssignedToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.DISTRICT_COURT_JUDGE_ASSIGNED },
      },
    ])
  }

  private addMessagesForDistrictCourtRegistrarAssignedToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.DISTRICT_COURT_REGISTRAR_ASSIGNED },
      },
    ])
  }

  private addMessagesForReceivedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: Message[] = [
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.RECEIVED_BY_COURT },
      },
    ]

    if (isIndictmentCase(theCase.type)) {
      messages.push({
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_INFO,
        user,
        caseId: theCase.id,
      })

      if (theCase.origin === CaseOrigin.LOKE) {
        messages.push({
          type: MessageType.DELIVERY_TO_POLICE_INDICTMENT,
          user,
          caseId: theCase.id,
        })
        theCase.policeCaseNumbers.forEach((policeCaseNumber) =>
          messages.push({
            type: MessageType.DELIVERY_TO_POLICE_CASE_FILES_RECORD,
            user,
            caseId: theCase.id,
            elementId: policeCaseNumber,
          }),
        )
      }
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForIndictmentCourtRoleAssigned(
    theCase: Case,
    user: TUser,
    assignedNationalId: string,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES,
        user,
        caseId: theCase.id,
        elementId: assignedNationalId,
      },
    ])
  }

  private addMessagesForIndictmentArraignmentDate(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_ARRAIGNMENT_DATE,
        user,
        caseId: theCase.id,
      },
    ])
  }

  private addMessagesForCourtCaseConnectionToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const message: Message = {
      type: MessageType.DELIVERY_TO_COURT_REQUEST,
      user,
      caseId: theCase.id,
    }

    return this.messageService.sendMessagesToQueue(
      [message]
        .concat(this.getDeliverProsecutorToCourtMessages(theCase, user))
        .concat(this.getDeliverDefendantToCourtMessages(theCase, user)),
    )
  }

  private addMessagesForIndictmentCourtCaseConnectionToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const deliverCaseFilesRecordToCourtMessages = theCase.policeCaseNumbers.map(
      (policeCaseNumber) => ({
        type: MessageType.DELIVERY_TO_COURT_CASE_FILES_RECORD,
        user,
        caseId: theCase.id,
        elementId: policeCaseNumber,
      }),
    )

    const caseFilesCategories = [
      CaseFileCategory.CRIMINAL_RECORD,
      CaseFileCategory.COST_BREAKDOWN,
      CaseFileCategory.CASE_FILE,
      CaseFileCategory.PROSECUTOR_CASE_FILE,
      CaseFileCategory.DEFENDANT_CASE_FILE,
      CaseFileCategory.CIVIL_CLAIM,
      CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
      CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
      CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
    ]

    const deliverCaseFileToCourtMessages =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            caseFile.category &&
            caseFilesCategories.includes(caseFile.category),
        )
        .map((caseFile) => ({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []

    const messages: Message[] = deliverCaseFilesRecordToCourtMessages.concat(
      deliverCaseFileToCourtMessages,
    )

    messages.push({
      type: MessageType.DELIVERY_TO_COURT_INDICTMENT,
      user,
      caseId: theCase.id,
    })

    if (theCase.state === CaseState.WAITING_FOR_CANCELLATION) {
      messages.push({
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE,
        user,
        caseId: theCase.id,
        // Upon case cancellation, we send the same notification type to:
        // (1) relevant court emails
        // (2) court system (via robot).
        //
        // When a case is revoked without a court case number, we send email (1).
        // The court must then add the case number in the system, triggering notification (2) for full cancellation.
        //
        // The court system requires a case number before posting data via robot, so it must be added despite the cancellation.
        // Notifications (1) and (2) must match, thus we use the flag below to ensure the same message is sent.
        // Without the flag, email (2) would get notification including the court case number.
        // For more context: https://github.com/island-is/island.is/pull/17385/files#r1904268032
        body: { withCourtCaseNumber: false },
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForDefenderEmailChangeToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue(
      this.getDeliverDefendantToCourtMessages(theCase, user),
    )
  }

  private addMessagesForProsecutorChangeToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue(
      this.getDeliverProsecutorToCourtMessages(theCase, user),
    )
  }

  private addMessagesForSignedCourtRecordToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages = []

    if (
      theCase.origin === CaseOrigin.LOKE &&
      isInvestigationCase(theCase.type)
    ) {
      messages.push({
        type: MessageType.DELIVERY_TO_POLICE_SIGNED_COURT_RECORD,
        user,
        caseId: theCase.id,
      })
    }

    messages.push({
      type: MessageType.DELIVERY_TO_COURT_SIGNED_COURT_RECORD,
      user,
      caseId: theCase.id,
    })

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForSignedRulingToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages = [
      {
        type: MessageType.DELIVERY_TO_COURT_SIGNED_RULING,
        user,
        caseId: theCase.id,
      },
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.RULING },
      },
    ]

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVERY_TO_POLICE_SIGNED_RULING,
        user,
        caseId: theCase.id,
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForCompletedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: Message[] = [
      {
        type: MessageType.DELIVERY_TO_COURT_CASE_CONCLUSION,
        user,
        caseId: theCase.id,
      },
      {
        type: MessageType.DELIVERY_TO_COURT_COURT_RECORD,
        user,
        caseId: theCase.id,
      },
    ]

    const deliverCaseFileToCourtMessages =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            // In restriction and investigation cases, ordinary case files do not have a category.
            // We should consider migrating all existing case files to have a category in the database.
            !caseFile.category,
        )
        .map((caseFile) => ({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []

    messages.push(...deliverCaseFileToCourtMessages)

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVERY_TO_POLICE_CASE,
        user,
        caseId: theCase.id,
      })
    }

    // kept as part of the ruling case notification type since this is a court decision to complete the case with no ruling
    if (theCase.isCompletedWithoutRuling) {
      messages.push({
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.RULING },
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForCompletedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: Message[] =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            caseFile.category &&
            [CaseFileCategory.COURT_RECORD, CaseFileCategory.RULING].includes(
              caseFile.category,
            ),
        )
        .map((caseFile) => ({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []
    messages.push({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.RULING },
    })

    if (
      hasGeneratedCourtRecordPdf(
        theCase.state,
        theCase.indictmentRulingDecision,
        theCase.courtSessions,
        user,
      )
    ) {
      messages.push({
        type: MessageType.DELIVERY_TO_COURT_COURT_RECORD,
        user,
        caseId: theCase.id,
      })
    }

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVERY_TO_POLICE_INDICTMENT_CASE,
        user,
        caseId: theCase.id,
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForModifiedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: Message[] = [
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.MODIFIED },
      },
    ]

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVERY_TO_POLICE_CASE,
        user,
        caseId: theCase.id,
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private getRevokeNotificationMessages(user: TUser, theCase: Case): Message[] {
    return [
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.REVOKED },
      },
    ]
  }

  private addMessagesForDeletedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue(
      this.getRevokeNotificationMessages(user, theCase),
    )
  }

  private async addMessagesForRevokedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages = this.getRevokeNotificationMessages(user, theCase)

    if (theCase.courtCaseNumber) {
      messages.push({
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE,
        user,
        caseId: theCase.id,
        body: { withCourtCaseNumber: true },
      })
    }

    // TODO: Use subpoenas already included in theCase.defendants
    // - no need to call the subpoena service
    // - then add to transition tests
    const subpoenasToRevoke = await this.subpoenaService.findByCaseId(
      theCase.id,
    )

    if (subpoenasToRevoke?.length > 0) {
      messages.push(
        ...subpoenasToRevoke.map((subpoena) => ({
          type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA_REVOCATION,
          user,
          caseId: theCase.id,
          elementId: [subpoena.defendantId, subpoena.id],
        })),
      )
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private async addMessagesForAppealedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    // If case was appealed in court we don't need to send these messages
    if (
      theCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
      theCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL
    ) {
      return
    }

    const messages: Message[] =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            caseFile.category &&
            [
              CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
              CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
            ].includes(caseFile.category),
        )
        .map((caseFile) => ({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []
    messages.push({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
    })

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForReceivedAppealCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.APPEAL_RECEIVED_BY_COURT },
      },
    ])
  }

  private addMessagesForCompletedAppealCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: Message[] =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            caseFile.category &&
            caseFile.category === CaseFileCategory.APPEAL_RULING,
        )
        .map((caseFile) => ({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []
    messages.push(
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.APPEAL_COMPLETED },
      },
      {
        type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION,
        user,
        caseId: theCase.id,
        // The APPEAL_COMPLETED notification must be handled before this message
        nextRetry:
          nowFactory().getTime() + this.config.robotMessageDelay * 1000,
      },
    )

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVERY_TO_POLICE_APPEAL,
        user,
        caseId: theCase.id,
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForAppealStatementToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.APPEAL_STATEMENT },
      },
    ])
  }

  private addMessagesForAppealWithdrawnToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.APPEAL_WITHDRAWN },
      },
    ])
  }

  private addMessagesForDeniedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.INDICTMENT_DENIED },
      },
    ])
  }

  private addMessagesForReturnedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.INDICTMENT_RETURNED },
      },
    ])
  }

  private addMessagesForNewAppealCaseNumberToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: Message[] =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.key &&
            caseFile.category &&
            [
              CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
              CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
              CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
              CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
              CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
              CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
            ].includes(caseFile.category),
        )
        .map((caseFile) => ({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []
    messages.push({
      type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
      user,
      caseId: theCase.id,
    })

    if (this.allAppealRolesAssigned(theCase)) {
      messages.push(
        ...this.getDeliverAssignedRolesToCourtOfAppealsMessages(user, theCase),
      )
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForAssignedAppealRolesToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue(
      this.getDeliverAssignedRolesToCourtOfAppealsMessages(user, theCase),
    )
  }

  private addMessagesForNewSubpoenasToQueue(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
  ) {
    const messages = updatedCase.defendants
      ?.filter(
        (updatedDefendant) =>
          theCase.defendants?.find(
            (defendant) => defendant.id === updatedDefendant.id,
          )?.subpoenas?.[0]?.id !== updatedDefendant.subpoenas?.[0]?.id, // Only deliver new subpoenas
      )
      .map((updatedDefendant) => [
        ...(updatedCase.origin === CaseOrigin.LOKE
          ? [
              {
                type: MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE,
                user,
                caseId: theCase.id,
                elementId: [
                  updatedDefendant.id,
                  updatedDefendant.subpoenas?.[0].id ?? '',
                ],
              },
            ]
          : []),
        {
          type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [
            updatedDefendant.id,
            updatedDefendant.subpoenas?.[0].id ?? '',
          ],
        },
        {
          type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [
            updatedDefendant.id,
            updatedDefendant.subpoenas?.[0].id ?? '',
          ],
        },
      ])

    if (messages && messages.length > 0) {
      return this.messageService.sendMessagesToQueue(messages.flat())
    }
  }

  private addMessagesForIndictmentArraignmentCompletionToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: Message[] = []

    theCase.defendants?.forEach((defendant) => {
      const subpoena = defendant.subpoenas?.[0]

      const hasSubpoenaBeenSuccessfullyServedToDefendant =
        subpoena?.serviceStatus &&
        [
          ServiceStatus.DEFENDER,
          ServiceStatus.ELECTRONICALLY,
          ServiceStatus.IN_PERSON,
        ].includes(subpoena.serviceStatus)

      // Only send certificates for subpoenas which have been successfully served
      if (hasSubpoenaBeenSuccessfullyServedToDefendant) {
        messages.push({
          type: MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE,
          user,
          caseId: theCase.id,
          elementId: [defendant.id, subpoena.id],
        })
      }
    })

    return this.messageService.sendMessagesToQueue(messages)
  }

  private async addMessagesForUpdatedCaseToQueue(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
  ): Promise<void> {
    const isIndictment = isIndictmentCase(updatedCase.type)

    if (updatedCase.state !== theCase.state) {
      // New case state
      if (
        updatedCase.state === CaseState.RECEIVED &&
        theCase.state === CaseState.SUBMITTED
      ) {
        // Only send messages if the case was in a SUBMITTED state - not when reopening a case
        await this.addMessagesForReceivedCaseToQueue(updatedCase, user)
      } else if (updatedCase.state === CaseState.DELETED) {
        if (!isIndictment) {
          await this.addMessagesForDeletedCaseToQueue(updatedCase, user)
        }
      } else if (isCompletedCase(updatedCase.state)) {
        if (isIndictment) {
          if (theCase.state !== CaseState.WAITING_FOR_CANCELLATION) {
            await this.addMessagesForCompletedIndictmentCaseToQueue(
              updatedCase,
              user,
            )
          }
        } else {
          await this.addMessagesForCompletedCaseToQueue(updatedCase, user)
        }
      } else if (updatedCase.state === CaseState.SUBMITTED && isIndictment) {
        await this.addMessagesForSubmittedIndictmentCaseToQueue(
          updatedCase,
          user,
        )
      } else if (
        updatedCase.state === CaseState.DRAFT &&
        theCase.state === CaseState.WAITING_FOR_CONFIRMATION &&
        isIndictment
      ) {
        await this.addMessagesForDeniedIndictmentCaseToQueue(updatedCase, user)
      } else if (
        updatedCase.state === CaseState.DRAFT &&
        theCase.state === CaseState.RECEIVED &&
        isIndictment
      ) {
        await this.addMessagesForReturnedIndictmentCaseToQueue(
          updatedCase,
          user,
        )
      } else if (updatedCase.state === CaseState.WAITING_FOR_CANCELLATION) {
        await this.addMessagesForRevokedIndictmentCaseToQueue(updatedCase, user)
      }
    }

    // This only applies to restriction cases
    if (updatedCase.appealState !== theCase.appealState) {
      if (updatedCase.appealState === CaseAppealState.APPEALED) {
        await this.addMessagesForAppealedCaseToQueue(updatedCase, user)
      } else if (
        theCase.appealState === CaseAppealState.APPEALED && // Do not send messages when reopening a case
        updatedCase.appealState === CaseAppealState.RECEIVED
      ) {
        await this.addMessagesForReceivedAppealCaseToQueue(updatedCase, user)
      } else if (updatedCase.appealState === CaseAppealState.COMPLETED) {
        await this.addMessagesForCompletedAppealCaseToQueue(updatedCase, user)
      } else if (updatedCase.appealState === CaseAppealState.WITHDRAWN) {
        await this.addMessagesForAppealWithdrawnToQueue(updatedCase, user)
      }
    }

    // This only applies to restriction cases
    if (
      updatedCase.prosecutorStatementDate?.getTime() !==
      theCase.prosecutorStatementDate?.getTime()
    ) {
      await this.addMessagesForAppealStatementToQueue(updatedCase, user)
    }

    // This only applies to restriction cases
    if (
      updatedCase.caseModifiedExplanation !== theCase.caseModifiedExplanation
    ) {
      // Case to dates modified
      await this.addMessagesForModifiedCaseToQueue(updatedCase, user)
    }

    if (updatedCase.courtCaseNumber) {
      if (updatedCase.courtCaseNumber !== theCase.courtCaseNumber) {
        // New court case number
        if (isIndictment) {
          await this.addMessagesForIndictmentCourtCaseConnectionToQueue(
            updatedCase,
            user,
          )
        } else {
          await this.addMessagesForCourtCaseConnectionToQueue(updatedCase, user)
        }
      } else {
        if (
          !isIndictment &&
          updatedCase.prosecutorId !== theCase.prosecutorId
        ) {
          // New prosecutor
          await this.addMessagesForProsecutorChangeToQueue(updatedCase, user)
        }

        if (
          !isIndictment &&
          updatedCase.defenderEmail !== theCase.defenderEmail
        ) {
          // New defender email
          await this.addMessagesForDefenderEmailChangeToQueue(updatedCase, user)
        }
      }
    }

    if (
      isIndictment &&
      [CaseState.SUBMITTED, CaseState.RECEIVED].includes(updatedCase.state)
    ) {
      const isJudgeChanged =
        updatedCase.judge &&
        updatedCase.judge.email &&
        updatedCase.judge.nationalId !== theCase.judge?.nationalId

      const isRegistrarChanged =
        updatedCase.registrar &&
        updatedCase.registrar.email &&
        updatedCase.registrar.nationalId !== theCase.registrar?.nationalId

      if (isJudgeChanged) {
        await this.addMessagesForDistrictCourtJudgeAssignedToQueue(
          updatedCase,
          user,
        )
      }

      if (isRegistrarChanged) {
        await this.addMessagesForDistrictCourtRegistrarAssignedToQueue(
          updatedCase,
          user,
        )
      }
    }

    if (
      isIndictment &&
      ![
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.WAITING_FOR_CONFIRMATION,
      ].includes(updatedCase.state)
    ) {
      const updatedRole =
        updatedCase.judge?.nationalId !== theCase.judge?.nationalId
          ? updatedCase.judge
          : updatedCase.registrar?.nationalId !== theCase.registrar?.nationalId
          ? updatedCase.registrar
          : null

      if (updatedRole?.nationalId) {
        await this.addMessagesForIndictmentCourtRoleAssigned(
          updatedCase,
          user,
          updatedRole.nationalId,
        )
      }
    }

    // This only applies to restriction cases
    if (updatedCase.appealCaseNumber) {
      if (updatedCase.appealCaseNumber !== theCase.appealCaseNumber) {
        // New appeal case number
        await this.addMessagesForNewAppealCaseNumberToQueue(updatedCase, user)
      } else if (
        this.allAppealRolesAssigned(updatedCase) &&
        (updatedCase.appealAssistantId !== theCase.appealAssistantId ||
          updatedCase.appealJudge1Id !== theCase.appealJudge1Id ||
          updatedCase.appealJudge2Id !== theCase.appealJudge2Id ||
          updatedCase.appealJudge3Id !== theCase.appealJudge3Id)
      ) {
        // New appeal court
        await this.addMessagesForAssignedAppealRolesToQueue(updatedCase, user)
      }
    }

    // This only applies to indictments
    if (isIndictment) {
      const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)
      const updatedArraignmentDate = DateLog.arraignmentDate(
        updatedCase.dateLogs,
      )
      const hasUpdatedArraignmentDate =
        updatedArraignmentDate &&
        updatedArraignmentDate.date.getTime() !==
          arraignmentDate?.date.getTime()

      if (hasUpdatedArraignmentDate) {
        await this.addMessagesForIndictmentArraignmentDate(updatedCase, user)
      }

      await this.addMessagesForNewSubpoenasToQueue(theCase, updatedCase, user)
    }

    // This only applies to indictments and only when an arraignment has been completed
    if (updatedCase.indictmentDecision && !theCase.indictmentDecision) {
      await this.addMessagesForIndictmentArraignmentCompletionToQueue(
        updatedCase,
        user,
      )
    }
  }

  private allAppealRolesAssigned(updatedCase: Case) {
    return (
      updatedCase.appealAssistantId &&
      updatedCase.appealJudge1Id &&
      updatedCase.appealJudge2Id &&
      updatedCase.appealJudge3Id
    )
  }

  async findById(
    caseId: string,
    allowDeleted = false,
    transaction?: Transaction,
  ): Promise<Case> {
    const theCase = await this.caseRepositoryService.findOne({
      include,
      where: {
        id: caseId,
        ...(allowDeleted ? {} : { state: { [Op.not]: CaseState.DELETED } }),
        isArchived: false,
      },
      transaction,
    })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return theCase
  }

  async findMinimalById(id: string): Promise<MinimalCase> {
    const minimalCase = await this.caseRepositoryService.findOne({
      where: {
        id,
        isArchived: false,
        state: { [Op.not]: CaseState.DELETED },
      },
    })

    if (!minimalCase) {
      throw new NotFoundException(`Case ${id} not found`)
    }

    return minimalCase
  }

  getAll(user: TUser): Promise<Case[]> {
    return this.caseRepositoryService.findAll({
      include: caseListInclude,
      where: getCasesQueryFilter(user),
    })
  }

  getConnectedIndictmentCases(
    caseId: string,
    defendant: Defendant,
  ): Promise<Case[]> {
    return this.caseRepositoryService.findAll({
      include: [
        { model: Institution, as: 'court' },
        {
          model: Defendant,
          as: 'defendants',
          required: true,
          where: defendant.noNationalId
            ? { nationalId: defendant.nationalId, name: defendant.name }
            : {
                nationalId: {
                  [Op.in]: normalizeAndFormatNationalId(defendant.nationalId),
                },
              },
        },
      ],
      attributes: ['id', 'courtCaseNumber', 'type', 'state'],
      where: {
        [Op.and]: {
          isArchived: false,
          type: CaseType.INDICTMENT,
          id: { [Op.ne]: caseId },
          state: CaseState.RECEIVED,
        },
      },
    })
  }

  async create(caseToCreate: CreateCaseDto, user: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            ...caseToCreate,
            origin: CaseOrigin.RVG,
            creatingProsecutorId: user.id,
            prosecutorId: isIndictmentCase(caseToCreate.type)
              ? caseToCreate.prosecutorId
              : user.role === UserRole.PROSECUTOR
              ? user.id
              : undefined,
            courtId: isRequestCase(caseToCreate.type)
              ? user.institution?.defaultCourtId
              : undefined,
            prosecutorsOfficeId: user.institution?.id,
          } as CreateCaseDto,
          transaction,
        )

        await this.defendantService.createForNewCase(caseId, {}, transaction)

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  private async handleDateLogUpdates(
    theCase: Case,
    update: UpdateCase,
    transaction: Transaction,
  ) {
    // Iterate over all known date log types
    for (const key in dateLogTypes) {
      const dateKey = key as DateLogKeys
      const updateDateLog = update[dateKey]

      if (updateDateLog !== undefined) {
        const dateType = dateLogTypes[dateKey]

        const dateLog = await this.dateLogModel.findOne({
          where: { caseId: theCase.id, dateType },
          transaction,
        })

        if (dateLog) {
          if (updateDateLog === null) {
            await this.dateLogModel.destroy({
              where: { caseId: theCase.id, dateType },
              transaction,
            })
          } else {
            await this.dateLogModel.update(updateDateLog, {
              where: { caseId: theCase.id, dateType },
              transaction,
            })
          }
        } else if (updateDateLog !== null) {
          await this.dateLogModel.create(
            {
              caseId: theCase.id,
              dateType,
              ...updateDateLog,
            },
            { transaction },
          )
        }

        delete update[dateKey]
      }
    }
  }

  private async handleCaseStringUpdates(
    theCase: Case,
    update: UpdateCase,
    transaction: Transaction,
  ) {
    // Iterate over all known case string types
    for (const key in caseStringTypes) {
      const caseStringKey = key as CaseStringKeys
      const updateCaseString = update[caseStringKey]

      if (updateCaseString !== undefined) {
        const stringType = caseStringTypes[caseStringKey]

        const caseString = await this.caseStringModel.findOne({
          where: { caseId: theCase.id, stringType },
          transaction,
        })

        if (caseString) {
          if (updateCaseString === null) {
            await this.caseStringModel.destroy({
              where: { caseId: theCase.id, stringType },
              transaction,
            })
          } else {
            await this.caseStringModel.update(
              { value: updateCaseString },
              { where: { caseId: theCase.id, stringType }, transaction },
            )
          }
        } else if (updateCaseString !== null) {
          await this.caseStringModel.create(
            { caseId: theCase.id, stringType, value: updateCaseString },
            { transaction },
          )
        }

        delete update[caseStringKey]
      }
    }
  }

  private async handleStateChangeEventLogUpdatesForIndictments(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
    transaction: Transaction,
  ) {
    if (
      updatedCase.state === CaseState.SUBMITTED &&
      theCase.state === CaseState.WAITING_FOR_CONFIRMATION
    ) {
      return this.eventLogService.createWithUser(
        EventType.INDICTMENT_CONFIRMED,
        theCase.id,
        user,
        transaction,
      )
    }

    if (updatedCase.state === CaseState.COMPLETED) {
      return this.eventLogService.createWithUser(
        EventType.INDICTMENT_COMPLETED,
        theCase.id,
        user,
        transaction,
      )
    }
  }

  private async handleStateChangeEventLogUpdatesForRequest(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
    transaction: Transaction,
  ) {
    if (
      updatedCase.state === CaseState.SUBMITTED &&
      theCase.state === CaseState.DRAFT
    ) {
      return this.eventLogService.createWithUser(
        EventType.CASE_SENT_TO_COURT,
        theCase.id,
        user,
        transaction,
      )
    }

    if (isCompletedCase(updatedCase.state)) {
      return this.eventLogService.createWithUser(
        EventType.REQUEST_COMPLETED,
        theCase.id,
        user,
        transaction,
      )
    }
  }

  private async handleStateChangeEventLogUpdates(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
    transaction: Transaction,
  ) {
    if (
      updatedCase.state === CaseState.RECEIVED &&
      theCase.state === CaseState.SUBMITTED
    ) {
      return this.eventLogService.createWithUser(
        EventType.CASE_RECEIVED_BY_COURT,
        theCase.id,
        user,
        transaction,
      )
    }

    if (isIndictmentCase(theCase.type)) {
      return this.handleStateChangeEventLogUpdatesForIndictments(
        theCase,
        updatedCase,
        user,
        transaction,
      )
    }

    if (isRequestCase(theCase.type)) {
      return this.handleStateChangeEventLogUpdatesForRequest(
        theCase,
        updatedCase,
        user,
        transaction,
      )
    }
  }

  private async handleCreateFirstCourtSession(
    theCase: Case,
    transaction: Transaction,
  ) {
    // Guard against unexpected existing court sessions
    if (theCase.courtSessions && theCase.courtSessions.length > 0) {
      return
    }

    // Create the first court session and then add court documents to it
    const courtSession = await this.courtSessionService.create(
      theCase.id,
      transaction,
    )

    // Start with the generated indictment PDF
    await this.courtDocumentService.createInCourtSession(
      theCase.id,
      courtSession.id,
      {
        documentType: CourtDocumentType.GENERATED_DOCUMENT,
        name: 'Ákæra',
        generatedPdfUri: `/api/case/${theCase.id}/indictment/Ákæra`,
      },
      transaction,
    )

    const caseFiles = theCase.caseFiles ?? []

    // Add all criminal records
    for (const caseFile of caseFiles.filter(
      (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
    ) ?? []) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        transaction,
      )
    }

    // Add all cost breakdowns
    for (const caseFile of caseFiles.filter(
      (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
    ) ?? []) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        transaction,
      )
    }

    // Add all case files records
    for (const policeCaseNumber of theCase.policeCaseNumbers) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.GENERATED_DOCUMENT,
          name: `Skjalaskrá ${policeCaseNumber}`,
          generatedPdfUri: `/api/case/${theCase.id}/caseFilesRecord/${policeCaseNumber}`,
        },
        transaction,
      )
    }

    // Add all remaining case files
    for (const caseFile of caseFiles?.filter(
      (file) =>
        file.category &&
        [
          CaseFileCategory.CASE_FILE,
          CaseFileCategory.PROSECUTOR_CASE_FILE,
          CaseFileCategory.DEFENDANT_CASE_FILE,
          CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIM,
        ].includes(file.category),
    ) ?? []) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        transaction,
      )
    }
  }

  private async handleEventLogUpdatesForIndictments(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
    transaction: Transaction,
  ) {
    if (
      updatedCase.indictmentReviewDecision &&
      !theCase.indictmentReviewDecision
    ) {
      await this.eventLogService.createWithUser(
        EventType.INDICTMENT_REVIEWED,
        theCase.id,
        user,
        transaction,
      )
    }

    const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)
    const updatedArraignmentDate = DateLog.arraignmentDate(updatedCase.dateLogs)
    const hasUpdatedArraignmentDate =
      updatedArraignmentDate &&
      updatedArraignmentDate.date.getTime() !== arraignmentDate?.date.getTime()
    const courtDate = DateLog.courtDate(theCase.dateLogs)
    const updatedCourtDate = DateLog.courtDate(updatedCase.dateLogs)
    const hasUpdatedCourtDate =
      updatedCourtDate &&
      updatedCourtDate.date.getTime() !== courtDate?.date.getTime()

    if (hasUpdatedArraignmentDate || hasUpdatedCourtDate) {
      await this.eventLogService.createWithUser(
        EventType.COURT_DATE_SCHEDULED,
        theCase.id,
        user,
        transaction,
      )
    }
  }

  private async handleEventLogUpdates(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
    transaction: Transaction,
  ) {
    if (updatedCase.state !== theCase.state) {
      await this.handleStateChangeEventLogUpdates(
        theCase,
        updatedCase,
        user,
        transaction,
      )
    }

    if (isIndictmentCase(theCase.type)) {
      await this.handleEventLogUpdatesForIndictments(
        theCase,
        updatedCase,
        user,
        transaction,
      )
    }
  }

  async update(
    theCase: Case,
    update: UpdateCase,
    user: TUser,
    returnUpdatedCase = true,
  ): Promise<Case | undefined> {
    const isReceivingCase =
      update.courtCaseNumber && theCase.state === CaseState.SUBMITTED

    const isReceivingIndictmentCase =
      isReceivingCase && isIndictmentCase(theCase.type)

    const completingIndictmentCase =
      isIndictmentCase(theCase.type) && update.state === CaseState.COMPLETED

    const completingIndictmentCaseWithoutRuling =
      completingIndictmentCase &&
      theCase.indictmentRulingDecision &&
      [
        CaseIndictmentRulingDecision.FINE,
        CaseIndictmentRulingDecision.CANCELLATION,
        CaseIndictmentRulingDecision.MERGE,
        CaseIndictmentRulingDecision.WITHDRAWAL,
      ].includes(theCase.indictmentRulingDecision)

    const completingIndictmentCaseWithRuling =
      completingIndictmentCase &&
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

    const requiresCourtTransition =
      theCase.courtId &&
      update.courtId &&
      theCase.courtId !== update.courtId &&
      theCase.state === CaseState.RECEIVED

    const updatedArraignmentDate = update.arraignmentDate
    const schedulingNewArraignmentDateForIndictmentCase =
      isIndictmentCase(theCase.type) && Boolean(updatedArraignmentDate)

    if (isReceivingCase) {
      update = transitionCase(CaseTransition.RECEIVE, theCase, user, update)
    }

    if (requiresCourtTransition) {
      update = transitionCase(CaseTransition.MOVE, theCase, user, update)
    }

    return this.sequelize
      .transaction(async (transaction) => {
        await this.handleDateLogUpdates(theCase, update, transaction)
        await this.handleCaseStringUpdates(theCase, update, transaction)

        if (Object.keys(update).length > 0) {
          await this.caseRepositoryService.update(theCase.id, update, {
            transaction,
          })
        }

        // Update police case numbers of case files if necessary
        await this.handlePoliceCaseNumbersUpdate(theCase, update, transaction)

        // Reset case file states if court case number is changed
        if (
          theCase.courtCaseNumber &&
          update.courtCaseNumber &&
          update.courtCaseNumber !== theCase.courtCaseNumber
        ) {
          await this.fileService.resetCaseFileStates(theCase.id, transaction)
        }

        // Handle first court session creation if receiving an indictment case
        if (isReceivingIndictmentCase) {
          await this.handleCreateFirstCourtSession(theCase, transaction)
        }

        // Create new subpoenas if scheduling a new arraignment date for an indictment case
        if (
          schedulingNewArraignmentDateForIndictmentCase &&
          theCase.defendants
        ) {
          await Promise.all(
            theCase.defendants
              .filter((defendant) => !defendant.isAlternativeService)
              .map(async (defendant) => {
                const subpoena = await this.subpoenaService.createSubpoena(
                  defendant.id,
                  theCase.id,
                  transaction,
                  updatedArraignmentDate?.date,
                  updatedArraignmentDate?.location,
                  defendant.subpoenaType,
                )

                const name = `Fyrirkall ${defendant.name} ${formatDate(
                  subpoena.created,
                )}`

                return this.courtDocumentService.create(
                  theCase.id,
                  {
                    documentType: CourtDocumentType.GENERATED_DOCUMENT,
                    name,
                    generatedPdfUri: `/api/case/${theCase.id}/subpoena/${defendant.id}/${subpoena.id}/${name}`,
                  },
                  transaction,
                )
              }),
          )
        }

        // create new verdict for each defendant when indictment is completed with ruling
        if (completingIndictmentCaseWithRuling && theCase.defendants) {
          await Promise.all(
            theCase.defendants.map((defendant) =>
              this.verdictService.createVerdict(
                defendant.id,
                theCase.id,
                transaction,
              ),
            ),
          )
        }

        // Remove uploaded ruling files if an indictment case is completed without a ruling
        if (completingIndictmentCaseWithoutRuling && theCase.caseFiles) {
          await Promise.all(
            theCase.caseFiles
              .filter(
                (caseFile) => caseFile.category === CaseFileCategory.RULING,
              )
              .map((caseFile) =>
                this.fileService.deleteCaseFile(theCase, caseFile, transaction),
              ),
          )
        }

        const updatedCase = await this.findById(theCase.id, true, transaction)

        await this.handleEventLogUpdates(
          theCase,
          updatedCase,
          user,
          transaction,
        )

        return updatedCase
      })
      .then(async (updatedCase) => {
        await this.addMessagesForUpdatedCaseToQueue(theCase, updatedCase, user)

        if (isReceivingCase) {
          this.eventService.postEvent(CaseTransition.RECEIVE, updatedCase)
        }

        if (requiresCourtTransition) {
          this.eventService.postEvent(
            CaseTransition.MOVE,
            updatedCase ?? theCase,
            false,
            {
              from: theCase.court?.name,
              to: updatedCase?.court?.name,
            },
          )
        }

        if (returnUpdatedCase) {
          return updatedCase
        }
      })
  }

  async requestCourtRecordSignature(
    theCase: Case,
    user: TUser,
  ): Promise<SigningServiceResponse> {
    await this.refreshFormatMessage()

    const pdf = await getCourtRecordPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        user.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        user.name ?? '',
        'Ísland',
        'courtRecord.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a court record signature',
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: user.name,
            institution: user.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getCourtRecordSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestCourtRecordSignature

    try {
      const courtRecordPdf = await this.signingService.waitForSignature(
        'courtRecord.pdf',
        documentToken,
      )
      const awsSuccess = await this.uploadSignedCourtRecordPdfToS3(
        theCase,
        courtRecordPdf,
      )

      if (!awsSuccess) {
        return { documentSigned: false, message: 'Failed to upload to S3' }
      }

      await this.update(
        theCase,
        {
          courtRecordSignatoryId: user.id,
          courtRecordSignatureDate: nowFactory(),
        },
        user,
        false,
      )

      await this.addMessagesForSignedCourtRecordToQueue(theCase, user)

      return { documentSigned: true }
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to get a court record signature confirmation',
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
          courtCaseNumber: theCase.courtCaseNumber,
          actor: user.name,
          institution: user.institution?.name,
        },
        error as Error,
      )

      if (error instanceof DokobitError) {
        return {
          documentSigned: false,
          code: error.code,
          message: error.message,
        }
      }

      throw error
    }
  }

  async requestRulingSignature(theCase: Case): Promise<SigningServiceResponse> {
    await this.refreshFormatMessage()

    const pdf = await getRulingPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        theCase.judge?.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        theCase.judge?.name ?? '',
        'Ísland',
        'ruling.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a ruling signature',
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: theCase.judge?.name,
            institution: theCase.judge?.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getRulingSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestRulingSignature
    try {
      const signedPdf = await this.signingService.waitForSignature(
        'ruling.pdf',
        documentToken,
      )
      const awsSuccess = await this.uploadSignedRulingPdfToS3(
        theCase,
        signedPdf,
      )

      if (!awsSuccess) {
        return { documentSigned: false, message: 'Failed to upload to S3' }
      }

      await this.update(
        theCase,
        { rulingSignatureDate: nowFactory() },
        user,
        false,
      )

      await this.addMessagesForSignedRulingToQueue(theCase, user)

      return { documentSigned: true }
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to get a ruling signature confirmation',
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
          courtCaseNumber: theCase.courtCaseNumber,
          actor: user.name,
          institution: user.institution?.name,
        },
        error as Error,
      )

      if (error instanceof DokobitError) {
        return {
          documentSigned: false,
          code: error.code,
          message: error.message,
        }
      }

      throw error
    }
  }

  async extend(theCase: Case, user: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            origin: theCase.origin,
            type: theCase.type,
            description: theCase.description,
            policeCaseNumbers: theCase.policeCaseNumbers,
            defenderName: theCase.defenderName,
            defenderNationalId: theCase.defenderNationalId,
            defenderEmail: theCase.defenderEmail,
            defenderPhoneNumber: theCase.defenderPhoneNumber,
            leadInvestigator: theCase.leadInvestigator,
            courtId: theCase.courtId,
            translator: theCase.translator,
            lawsBroken: theCase.lawsBroken,
            legalBasis: theCase.legalBasis,
            legalProvisions: theCase.legalProvisions,
            requestedCustodyRestrictions: theCase.requestedCustodyRestrictions,
            caseFacts: theCase.caseFacts,
            legalArguments: theCase.legalArguments,
            requestProsecutorOnlySession: theCase.requestProsecutorOnlySession,
            prosecutorOnlySessionRequest: theCase.prosecutorOnlySessionRequest,
            parentCaseId: theCase.id,
            initialRulingDate: theCase.initialRulingDate ?? theCase.rulingDate,
            creatingProsecutorId: user.id,
            prosecutorId: user.id,
            prosecutorsOfficeId: user.institution?.id,
            demands: isInvestigationCase(theCase.type)
              ? theCase.demands
              : undefined,
          } as CreateCaseDto,
          transaction,
        )

        if (theCase.defendants && theCase.defendants?.length > 0) {
          await Promise.all(
            theCase.defendants?.map((defendant) =>
              this.defendantService.createForNewCase(
                caseId,
                {
                  noNationalId: defendant.noNationalId,
                  nationalId: defendant.nationalId,
                  name: defendant.name,
                  gender: defendant.gender,
                  address: defendant.address,
                  citizenship: defendant.citizenship,
                },
                transaction,
              ),
            ),
          )
        }

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async createCourtCase(theCase: Case, user: TUser): Promise<Case> {
    const receivalDate =
      EventLog.getEventLogDateByEventType(
        [EventType.CASE_RECEIVED_BY_COURT, EventType.INDICTMENT_CONFIRMED],
        theCase.eventLogs,
      ) ?? nowFactory()

    const courtCaseNumber = await this.courtService.createCourtCase(
      user,
      theCase.id,
      theCase.courtId,
      theCase.type,
      receivalDate,
      theCase.policeCaseNumbers,
      Boolean(theCase.parentCaseId),
      theCase.indictmentSubtypes,
    )

    const updatedCase = (await this.update(
      theCase,
      { courtCaseNumber },
      user,
      true,
    )) as Case

    return updatedCase
  }
}
