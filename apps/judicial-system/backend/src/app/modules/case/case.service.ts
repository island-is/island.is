import { Op } from 'sequelize'
import { Includeable, OrderItem, Transaction } from 'sequelize/types'
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
  CaseMessage,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  CaseState,
  CaseTransition,
  CaseType,
  CommentType,
  DateType,
  EventType,
  isCompletedCase,
  isIndictmentCase,
  isRestrictionCase,
  isTrafficViolationCase,
  NotificationType,
  prosecutorCanSelectDefenderForInvestigationCase,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import {
  getCourtRecordPdfAsString,
  getRulingPdfAsString,
} from '../../formatters'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { Defendant, DefendantService } from '../defendant'
import { CaseEvent, EventService } from '../event'
import { EventLog, EventLogService } from '../event-log'
import { CaseFile, FileService } from '../file'
import { IndictmentCount } from '../indictment-count'
import { Institution } from '../institution'
import { Notification } from '../notification'
import { User } from '../user'
import { CreateCaseDto } from './dto/createCase.dto'
import { getCasesQueryFilter } from './filters/cases.filter'
import { Case } from './models/case.model'
import { DateLog } from './models/dateLog.model'
import { ExplanatoryComment } from './models/explanatoryComment.model'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { transitionCase } from './state/case.state'
import { caseModuleConfig } from './case.config'

interface UpdateDateLog {
  date?: Date
  location?: string
}
export interface UpdateCase
  extends Pick<
    Case,
    | 'indictmentSubtypes'
    | 'description'
    | 'defenderName'
    | 'defenderNationalId'
    | 'defenderEmail'
    | 'defenderPhoneNumber'
    | 'isHeightenedSecurityLevel'
    | 'courtId'
    | 'leadInvestigator'
    | 'arrestDate'
    | 'requestedCourtDate'
    | 'translator'
    | 'requestedValidToDate'
    | 'demands'
    | 'lawsBroken'
    | 'legalBasis'
    | 'legalProvisions'
    | 'requestedCustodyRestrictions'
    | 'requestedOtherRestrictions'
    | 'caseFacts'
    | 'legalArguments'
    | 'requestProsecutorOnlySession'
    | 'prosecutorOnlySessionRequest'
    | 'comments'
    | 'caseFilesComments'
    | 'prosecutorId'
    | 'sharedWithProsecutorsOfficeId'
    | 'sessionArrangements'
    | 'courtLocation'
    | 'courtStartDate'
    | 'courtEndTime'
    | 'isClosedCourtHidden'
    | 'courtAttendees'
    | 'prosecutorDemands'
    | 'courtDocuments'
    | 'sessionBookings'
    | 'courtCaseFacts'
    | 'introduction'
    | 'courtLegalArguments'
    | 'ruling'
    | 'decision'
    | 'validToDate'
    | 'isCustodyIsolation'
    | 'isolationToDate'
    | 'conclusion'
    | 'endOfSessionBookings'
    | 'accusedAppealDecision'
    | 'accusedAppealAnnouncement'
    | 'prosecutorAppealDecision'
    | 'prosecutorAppealAnnouncement'
    | 'accusedPostponedAppealDate'
    | 'prosecutorPostponedAppealDate'
    | 'registrarId'
    | 'caseModifiedExplanation'
    | 'rulingModifiedHistory'
    | 'caseResentExplanation'
    | 'crimeScenes'
    | 'indictmentIntroduction'
    | 'requestDriversLicenseSuspension'
    | 'creatingProsecutorId'
    | 'appealState'
    | 'prosecutorStatementDate'
    | 'appealReceivedByCourtDate'
    | 'appealCaseNumber'
    | 'appealAssistantId'
    | 'appealJudge1Id'
    | 'appealJudge2Id'
    | 'appealJudge3Id'
    | 'appealConclusion'
    | 'appealRulingDecision'
    | 'appealRulingModifiedHistory'
    | 'requestSharedWithDefender'
    | 'appealValidToDate'
    | 'isAppealCustodyIsolation'
    | 'appealIsolationToDate'
    | 'indictmentRulingDecision'
    | 'indictmentReviewerId'
  > {
  type?: CaseType
  state?: CaseState
  policeCaseNumbers?: string[]
  defendantWaivesRightToCounsel?: boolean
  rulingDate?: Date | null
  rulingSignatureDate?: Date | null
  courtCaseNumber?: string | null
  courtRecordSignatoryId?: string | null
  courtRecordSignatureDate?: Date | null
  parentCaseId?: string | null
  arraignmentDate?: UpdateDateLog | null
  courtDate?: UpdateDateLog | null
  postponedIndefinitelyExplanation?: string | null
  judgeId?: string | null
  indictmentReturnedExplanation?: string | null
  indictmentDeniedExplanation?: string | null
  indictmentHash?: string | null
}

type DateLogKeys = keyof Pick<UpdateCase, 'arraignmentDate' | 'courtDate'>

const dateLogTypes: Record<DateLogKeys, DateType> = {
  arraignmentDate: DateType.ARRAIGNMENT_DATE,
  courtDate: DateType.COURT_DATE,
}

type ExplanatoryCommentKeys = keyof Pick<
  UpdateCase,
  'postponedIndefinitelyExplanation'
>

const explanatoryCommentTypes: Record<ExplanatoryCommentKeys, CommentType> = {
  postponedIndefinitelyExplanation:
    CommentType.POSTPONED_INDEFINITELY_EXPLANATION,
}

const eventTypes = Object.values(EventType)
const dateTypes = Object.values(DateType)
const commentTypes = Object.values(CommentType)

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
  { model: Defendant, as: 'defendants' },
  { model: IndictmentCount, as: 'indictmentCounts' },
  {
    model: CaseFile,
    as: 'caseFiles',
    required: false,
    where: { state: { [Op.not]: CaseFileState.DELETED } },
    separate: true,
  },
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    where: { eventType: { [Op.in]: eventTypes } },
    order: [['created', 'ASC']],
    separate: true,
  },
  {
    model: DateLog,
    as: 'dateLogs',
    required: false,
    where: { dateType: { [Op.in]: dateTypes } },
  },
  {
    model: ExplanatoryComment,
    as: 'explanatoryComments',
    required: false,
    where: { commentType: { [Op.in]: commentTypes } },
  },
  { model: Notification, as: 'notifications' },
]

export const order: OrderItem[] = [
  [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
  [{ model: IndictmentCount, as: 'indictmentCounts' }, 'created', 'ASC'],
  [{ model: DateLog, as: 'dateLogs' }, 'created', 'DESC'],
  [{ model: Notification, as: 'notifications' }, 'created', 'DESC'],
]

export const caseListInclude: Includeable[] = [
  { model: Institution, as: 'prosecutorsOffice' },
  { model: Defendant, as: 'defendants' },
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
    where: { dateType: { [Op.in]: dateTypes } },
  },
  {
    model: ExplanatoryComment,
    as: 'explanatoryComments',
    required: false,
    where: { commentType: { [Op.in]: commentTypes } },
  },
]

export const listOrder: OrderItem[] = [
  [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
  [{ model: DateLog, as: 'dateLogs' }, 'created', 'DESC'],
]

@Injectable()
export class CaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(DateLog) private readonly dateLogModel: typeof DateLog,
    @InjectModel(ExplanatoryComment)
    private readonly explanatoryCommentModel: typeof ExplanatoryComment,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly defendantService: DefendantService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    private readonly eventLogService: EventLogService,
    private readonly messageService: MessageService,
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
      .putGeneratedObject(theCase.type, `${theCase.id}/ruling.pdf`, pdf)
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
      .putGeneratedObject(theCase.type, `${theCase.id}/courtRecord.pdf`, pdf)
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
    const theCase = await this.caseModel.create(
      {
        ...caseToCreate,
        state: isIndictmentCase(caseToCreate.type)
          ? CaseState.DRAFT
          : CaseState.NEW,
      },
      { transaction },
    )

    return theCase.id
  }

  private async syncPoliceCaseNumbersAndCaseFiles(
    theCase: Case,
    update: UpdateCase,
    transaction: Transaction,
  ): Promise<void> {
    if (update.policeCaseNumbers && theCase.caseFiles) {
      const oldPoliceCaseNumbers = theCase.policeCaseNumbers
      const newPoliceCaseNumbers = update.policeCaseNumbers
      const maxIndex = Math.max(
        oldPoliceCaseNumbers.length,
        newPoliceCaseNumbers.length,
      )

      // Assumptions:
      // 1. The police case numbers are in the same order as they were before
      // 2. The police case numbers are not duplicated
      // 3. At most one police case number is changed, added or removed
      for (let i = 0; i < maxIndex; i++) {
        // Police case number added
        if (i === oldPoliceCaseNumbers.length) {
          break
        }

        // Police case number deleted
        if (
          i === newPoliceCaseNumbers.length ||
          (newPoliceCaseNumbers[i] !== oldPoliceCaseNumbers[i] &&
            newPoliceCaseNumbers.length < oldPoliceCaseNumbers.length)
        ) {
          for (const caseFile of theCase.caseFiles) {
            if (caseFile.policeCaseNumber === oldPoliceCaseNumbers[i]) {
              await this.fileService.deleteCaseFile(
                theCase,
                caseFile,
                transaction,
              )
            }
          }

          break
        }

        // Police case number unchanged
        if (newPoliceCaseNumbers[i] === oldPoliceCaseNumbers[i]) {
          continue
        }

        // Police case number changed
        for (const caseFile of theCase.caseFiles) {
          if (caseFile.policeCaseNumber === oldPoliceCaseNumbers[i]) {
            await this.fileService.updateCaseFile(
              theCase.id,
              caseFile.id,
              { policeCaseNumber: newPoliceCaseNumbers[i] },
              transaction,
            )
          }
        }

        break
      }
    }
  }

  private getDeliverDefendantToCourtMessages(
    theCase: Case,
    user: TUser,
  ): CaseMessage[] {
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
  ): CaseMessage[] {
    const messages = [
      {
        type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
        user,
        caseId: theCase.id,
      },
    ]

    return messages
  }

  private getIndictmentArchiveMessages(
    theCase: Case,
    user: TUser,
    archiveCaseFilesRecords: boolean,
  ): CaseMessage[] {
    const messages: CaseMessage[] =
      theCase.caseFiles
        ?.filter((caseFile) => caseFile.key)
        .map((caseFile) => ({
          type: MessageType.ARCHIVING_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []

    if (archiveCaseFilesRecords) {
      const caseFilesRecordMessages =
        theCase.policeCaseNumbers?.map((policeCaseNumber) => ({
          type: MessageType.ARCHIVING_CASE_FILES_RECORD,
          user,
          caseId: theCase.id,
          elementId: policeCaseNumber,
        })) ?? []

      messages.push(...caseFilesRecordMessages)
    }

    return messages
  }

  private getDeliverAssignedRolesToCourtOfAppealsMessages(
    user: TUser,
    theCase: Case,
  ): CaseMessage[] {
    return [
      {
        type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
        user,
        caseId: theCase.id,
      },
    ]
  }

  private addMessagesForSubmittedIndicitmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: NotificationType.READY_FOR_COURT },
      },
    ])
  }

  private addMessagesForReceivedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: CaseMessage[] = [
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: NotificationType.RECEIVED_BY_COURT },
      },
    ]

    if (isIndictmentCase(theCase.type) && theCase.origin === CaseOrigin.LOKE) {
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

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForCourtCaseConnectionToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const message: CaseMessage = {
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
    const deliverCaseFilesRecordToCourtMessages =
      theCase.policeCaseNumbers.map<CaseMessage>((policeCaseNumber) => ({
        type: MessageType.DELIVERY_TO_COURT_CASE_FILES_RECORD,
        user,
        caseId: theCase.id,
        elementId: policeCaseNumber,
      }))

    const caseFilesCategories = isTrafficViolationCase(theCase)
      ? [
          CaseFileCategory.COVER_LETTER,
          CaseFileCategory.CRIMINAL_RECORD,
          CaseFileCategory.COST_BREAKDOWN,
        ]
      : [
          CaseFileCategory.COVER_LETTER,
          CaseFileCategory.INDICTMENT,
          CaseFileCategory.CRIMINAL_RECORD,
          CaseFileCategory.COST_BREAKDOWN,
        ]

    const deliverCaseFileToCourtMessages =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            ((caseFile.category &&
              caseFilesCategories.includes(caseFile.category)) ||
              (caseFile.category === CaseFileCategory.CASE_FILE &&
                !caseFile.policeCaseNumber)),
        )
        .map((caseFile) => ({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })) ?? []

    const messages = this.getDeliverProsecutorToCourtMessages(theCase, user)
      .concat(this.getDeliverDefendantToCourtMessages(theCase, user))
      .concat(deliverCaseFilesRecordToCourtMessages)
      .concat(deliverCaseFileToCourtMessages)

    if (isTrafficViolationCase(theCase)) {
      messages.push({
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT,
        user,
        caseId: theCase.id,
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
        body: { type: NotificationType.RULING },
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
    const messages = [
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

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForCompletedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue(
      this.getIndictmentArchiveMessages(theCase, user, true).concat([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId: theCase.id,
          body: { type: NotificationType.RULING },
        },
        {
          type: MessageType.DELIVERY_TO_POLICE_INDICTMENT_CASE,
          user,
          caseId: theCase.id,
        },
      ]),
    )
  }

  private addMessagesForModifiedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: CaseMessage[] = [
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: NotificationType.MODIFIED },
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

  private addMessagesForDeletedCaseToQueue(
    theCase: Case,
    user: TUser,
    previousState: CaseState,
  ): Promise<void> {
    const messages: CaseMessage[] = [
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: NotificationType.REVOKED },
      },
    ]

    // Indictment cases need some case file cleanup
    if (isIndictmentCase(theCase.type)) {
      messages.push(
        ...this.getIndictmentArchiveMessages(
          theCase,
          user,
          previousState === CaseState.RECEIVED,
        ),
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

    const messages: CaseMessage[] =
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
      body: { type: NotificationType.APPEAL_TO_COURT_OF_APPEALS },
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
        body: { type: NotificationType.APPEAL_RECEIVED_BY_COURT },
      },
    ])
  }

  private addMessagesForCompletedAppealCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: CaseMessage[] =
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
        body: { type: NotificationType.APPEAL_COMPLETED },
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
        body: { type: NotificationType.APPEAL_STATEMENT },
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
        body: { type: NotificationType.APPEAL_WITHDRAWN },
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
        body: { type: NotificationType.INDICTMENT_DENIED },
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
        body: { type: NotificationType.INDICTMENT_RETURNED },
      },
    ])
  }

  private addMessagesForNewAppealCaseNumberToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages: CaseMessage[] =
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

  private addMessagesForNewCourtDateToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: NotificationType.COURT_DATE },
      },
    ])
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
        await this.addMessagesForDeletedCaseToQueue(
          updatedCase,
          user,
          theCase.state,
        )
      } else if (isCompletedCase(updatedCase.state)) {
        if (isIndictment) {
          await this.addMessagesForCompletedIndictmentCaseToQueue(
            updatedCase,
            user,
          )
        } else {
          await this.addMessagesForCompletedCaseToQueue(updatedCase, user)
        }
      } else if (updatedCase.state === CaseState.SUBMITTED && isIndictment) {
        await this.addMessagesForSubmittedIndicitmentCaseToQueue(
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
        if (isIndictmentCase(updatedCase.type)) {
          await this.addMessagesForIndictmentCourtCaseConnectionToQueue(
            updatedCase,
            user,
          )
        } else {
          await this.addMessagesForCourtCaseConnectionToQueue(updatedCase, user)
        }
      } else {
        if (updatedCase.prosecutorId !== theCase.prosecutorId) {
          // New prosecutor
          await this.addMessagesForProsecutorChangeToQueue(updatedCase, user)
        }

        if (
          !isIndictmentCase(updatedCase.type) &&
          updatedCase.defenderEmail !== theCase.defenderEmail
        ) {
          // New defender email
          await this.addMessagesForDefenderEmailChangeToQueue(updatedCase, user)
        }
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
    const courtDate = DateLog.courtDate(theCase.dateLogs)
    const updatedCourtDate = DateLog.courtDate(updatedCase.dateLogs)
    if (updatedCourtDate && updatedCourtDate.date !== courtDate?.date) {
      // New court date
      await this.addMessagesForNewCourtDateToQueue(updatedCase, user)
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

  async findById(caseId: string, allowDeleted = false): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      include,
      order,
      where: {
        id: caseId,
        ...(allowDeleted ? {} : { state: { [Op.not]: CaseState.DELETED } }),
        isArchived: false,
      },
    })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return theCase
  }

  getAll(user: TUser): Promise<Case[]> {
    return this.caseModel.findAll({
      include: caseListInclude,
      order: listOrder,
      where: getCasesQueryFilter(user),
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
            prosecutorId:
              user.role === UserRole.PROSECUTOR ? user.id : undefined,
            courtId: user.institution?.defaultCourtId,
            prosecutorsOfficeId: user.institution?.id,
          } as CreateCaseDto,
          transaction,
        )

        await this.defendantService.createForNewCase(caseId, {}, transaction)

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  private async handleDateUpdates(
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

  private async handleCommentUpdates(
    theCase: Case,
    update: UpdateCase,
    transaction: Transaction,
  ) {
    // Iterate over all known explanatory comment types
    for (const key in explanatoryCommentTypes) {
      const commentKey = key as ExplanatoryCommentKeys
      const updateComment = update[commentKey]

      if (updateComment !== undefined) {
        const commentType = explanatoryCommentTypes[commentKey]

        const comment = await this.explanatoryCommentModel.findOne({
          where: { caseId: theCase.id, commentType },
          transaction,
        })

        if (comment) {
          if (updateComment === null) {
            await this.explanatoryCommentModel.destroy({
              where: { caseId: theCase.id, commentType },
              transaction,
            })
          } else {
            await this.explanatoryCommentModel.update(
              { comment: updateComment },
              { where: { caseId: theCase.id, commentType }, transaction },
            )
          }
        } else if (updateComment !== null) {
          await this.explanatoryCommentModel.create(
            { caseId: theCase.id, commentType, comment: updateComment },
            { transaction },
          )
        }

        delete update[commentKey]
      }
    }
  }

  handleEventLogs(
    theCase: Case,
    update: UpdateCase,
    user: TUser,
    transaction: Transaction,
  ) {
    if (
      isIndictmentCase(theCase.type) &&
      update.state === CaseState.SUBMITTED &&
      theCase.state === CaseState.WAITING_FOR_CONFIRMATION
    ) {
      return this.eventLogService.create(
        {
          eventType: EventType.INDICTMENT_CONFIRMED,
          caseId: theCase.id,
          nationalId: user.nationalId,
          userRole: user.role,
        },
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
    const receivingCase =
      update.courtCaseNumber && theCase.state === CaseState.SUBMITTED
    const returningIndictmentCase =
      update.state === CaseState.DRAFT && theCase.state === CaseState.RECEIVED

    return this.sequelize
      .transaction(async (transaction) => {
        if (receivingCase) {
          update.state = transitionCase(
            CaseTransition.RECEIVE,
            theCase.type,
            theCase.state,
            theCase.appealState,
          ).state
        }

        await this.handleDateUpdates(theCase, update, transaction)
        await this.handleCommentUpdates(theCase, update, transaction)
        await this.handleEventLogs(theCase, update, user, transaction)

        if (Object.keys(update).length === 0) {
          return
        }

        const [numberOfAffectedRows] = await this.caseModel.update(update, {
          where: { id: theCase.id },
          transaction,
        })

        if (numberOfAffectedRows > 1) {
          // Tolerate failure, but log error
          this.logger.error(
            `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case ${theCase.id}`,
          )
        } else if (numberOfAffectedRows < 1) {
          throw new InternalServerErrorException(
            `Could not update case ${theCase.id}`,
          )
        }

        // Update police case numbers of case files if necessary
        await this.syncPoliceCaseNumbersAndCaseFiles(
          theCase,
          update,
          transaction,
        )

        // Reset case file states if court case number is changed
        if (
          theCase.courtCaseNumber &&
          update.courtCaseNumber &&
          update.courtCaseNumber !== theCase.courtCaseNumber
        ) {
          await this.fileService.resetCaseFileStates(theCase.id, transaction)
        }

        if (returningIndictmentCase) {
          await this.fileService.resetIndictmentCaseFileHashes(
            theCase.id,
            transaction,
          )
        }
      })
      .then(async () => {
        const updatedCase = await this.findById(theCase.id, true)

        await this.addMessagesForUpdatedCaseToQueue(theCase, updatedCase, user)

        if (receivingCase) {
          this.eventService.postEvent(CaseEvent.RECEIVE, updatedCase)
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
        const shouldCopyDefender =
          isRestrictionCase(theCase.type) ||
          prosecutorCanSelectDefenderForInvestigationCase(theCase.type)

        const caseId = await this.createCase(
          {
            origin: theCase.origin,
            type: theCase.type,
            description: theCase.description,
            policeCaseNumbers: theCase.policeCaseNumbers,
            defenderName: shouldCopyDefender ? theCase.defenderName : undefined,
            defenderNationalId: shouldCopyDefender
              ? theCase.defenderNationalId
              : undefined,
            defenderEmail: shouldCopyDefender
              ? theCase.defenderEmail
              : undefined,
            defenderPhoneNumber: shouldCopyDefender
              ? theCase.defenderPhoneNumber
              : undefined,
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
    const courtCaseNumber = await this.courtService.createCourtCase(
      user,
      theCase.id,
      theCase.courtId,
      theCase.type,
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
