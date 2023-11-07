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
  completedCaseStates,
  EventType,
  isIndictmentCase,
  isRestrictionCase,
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
import { EventLog } from '../event-log'
import { CaseFile, FileService } from '../file'
import { IndictmentCount } from '../indictment-count'
import { Institution } from '../institution'
import { User } from '../user'
import { CreateCaseDto } from './dto/createCase.dto'
import { getCasesQueryFilter } from './filters/cases.filter'
import { Case } from './models/case.model'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { transitionCase } from './state/case.state'

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
    | 'courtCaseNumber'
    | 'sessionArrangements'
    | 'courtDate'
    | 'courtLocation'
    | 'courtRoom'
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
    | 'judgeId'
    | 'registrarId'
    | 'caseModifiedExplanation'
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
    | 'requestSharedWithDefender'
  > {
  type?: CaseType
  state?: CaseState
  policeCaseNumbers?: string[]
  defendantWaivesRightToCounsel?: boolean
  rulingDate?: Date | null
  rulingSignatureDate?: Date | null
  rulingModifiedHistory?: string
  courtRecordSignatoryId?: string | null
  courtRecordSignatureDate?: Date | null
  parentCaseId?: string | null
}

const eventTypes = Object.values(EventType)

export const include: Includeable[] = [
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
    model: Case,
    as: 'parentCase',
    include: [
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: { state: { [Op.not]: CaseFileState.DELETED }, category: null },
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
  },
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    where: {
      eventType: { [Op.in]: eventTypes },
    },
  },
]

export const order: OrderItem[] = [
  [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
  [{ model: IndictmentCount, as: 'indictmentCounts' }, 'created', 'ASC'],
]

export const caseListInclude: Includeable[] = [
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
]

export const listOrder: OrderItem[] = [
  [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
]

@Injectable()
export class CaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    private readonly defendantService: DefendantService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
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
      .putObject(`generated/${theCase.id}/ruling.pdf`, pdf)
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
      .putObject(`generated/${theCase.id}/courtRecord.pdf`, pdf)
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
    transaction?: Transaction,
  ): Promise<string> {
    const theCase = await (transaction
      ? this.caseModel.create(
          {
            ...caseToCreate,
            state: isIndictmentCase(caseToCreate.type)
              ? CaseState.DRAFT
              : undefined,
          },
          { transaction },
        )
      : this.caseModel.create({ ...caseToCreate }))

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
              await this.fileService.deleteCaseFile(caseFile, transaction)
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
        type: MessageType.DELIVER_DEFENDANT_TO_COURT,
        user,
        caseId: theCase.id,
        defendantId: defendant.id,
      })) ?? []

    return messages
  }

  private getDeliverProsecutorToCourtMessages(
    theCase: Case,
    user: TUser,
  ): CaseMessage[] {
    const messages = [
      {
        type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
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
          type: MessageType.ARCHIVE_CASE_FILE,
          user,
          caseId: theCase.id,
          caseFileId: caseFile.id,
        })) ?? []

    if (archiveCaseFilesRecords) {
      const caseFilesRecordMessages =
        theCase.policeCaseNumbers?.map((policeCaseNumber) => ({
          type: MessageType.ARCHIVE_CASE_FILES_RECORD,
          user,
          caseId: theCase.id,
          policeCaseNumber,
        })) ?? []

      messages.push(...caseFilesRecordMessages)
    }

    return messages
  }

  private addMessagesForSubmittedIndicitmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.SEND_READY_FOR_COURT_NOTIFICATION,
        user,
        caseId: theCase.id,
      },
    ])
  }

  private addMessagesForReceivedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION,
        user,
        caseId: theCase.id,
      },
    ])
  }

  private addMessagesForCourtCaseConnectionToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue(
      [{ type: MessageType.DELIVER_REQUEST_TO_COURT, user, caseId: theCase.id }]
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
        type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
        user,
        caseId: theCase.id,
        policeCaseNumber,
      }))

    const deliverCaseFileToCourtMessages =
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            ((caseFile.category &&
              [
                CaseFileCategory.COVER_LETTER,
                CaseFileCategory.INDICTMENT,
                CaseFileCategory.CRIMINAL_RECORD,
                CaseFileCategory.COST_BREAKDOWN,
              ].includes(caseFile.category)) ||
              (caseFile.category === CaseFileCategory.CASE_FILE &&
                !caseFile.policeCaseNumber)),
        )
        .map((caseFile) => ({
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          user,
          caseId: theCase.id,
          caseFileId: caseFile.id,
        })) ?? []

    return this.messageService.sendMessagesToQueue(
      this.getDeliverProsecutorToCourtMessages(theCase, user)
        .concat(this.getDeliverDefendantToCourtMessages(theCase, user))
        .concat(deliverCaseFilesRecordToCourtMessages)
        .concat(deliverCaseFileToCourtMessages),
    )
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

  private addMessagesForCompletedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    const messages = [
      {
        type: MessageType.DELIVER_SIGNED_RULING_TO_COURT,
        user,
        caseId: theCase.id,
      },
      {
        type: MessageType.DELIVER_CASE_CONCLUSION_TO_COURT,
        user,
        caseId: theCase.id,
      },
      { type: MessageType.SEND_RULING_NOTIFICATION, user, caseId: theCase.id },
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
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          user,
          caseId: theCase.id,
          caseFileId: caseFile.id,
        })) ?? []

    messages.push(...deliverCaseFileToCourtMessages, {
      type: MessageType.DELIVER_COURT_RECORD_TO_COURT,
      user,
      caseId: theCase.id,
    })

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVER_CASE_TO_POLICE,
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
          type: MessageType.SEND_RULING_NOTIFICATION,
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
    const messages = [
      {
        type: MessageType.SEND_MODIFIED_NOTIFICATION,
        user,
        caseId: theCase.id,
      },
    ]

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVER_CASE_TO_POLICE,
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
      { type: MessageType.SEND_REVOKED_NOTIFICATION, user, caseId: theCase.id },
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

  private addMessagesForAppealedCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    // If case was appealed in court we don't need to send these messages
    if (
      theCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
      theCase.prosecutorAppealDecision === CaseAppealDecision.ACCEPT
    ) {
      return Promise.resolve()
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
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          user,
          caseId: theCase.id,
          caseFileId: caseFile.id,
        })) ?? []
    messages.push({
      type: MessageType.SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION,
      user,
      caseId: theCase.id,
    })

    return this.messageService.sendMessagesToQueue(messages)
  }

  private addMessagesForReceivedAppealCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    return this.messageService.sendMessagesToQueue([
      {
        type: MessageType.SEND_APPEAL_RECEIVED_BY_COURT_NOTIFICATION,
        user,
        caseId: theCase.id,
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
            CaseFileCategory.APPEAL_RULING === caseFile.category,
        )
        .map((caseFile) => ({
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          user,
          caseId: theCase.id,
          caseFileId: caseFile.id,
        })) ?? []
    messages.push({
      type: MessageType.SEND_APPEAL_COMPLETED_NOTIFICATION,
      user,
      caseId: theCase.id,
    })

    if (theCase.origin === CaseOrigin.LOKE) {
      messages.push({
        type: MessageType.DELIVER_APPEAL_TO_POLICE,
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
        type: MessageType.SEND_APPEAL_STATEMENT_NOTIFICATION,
        user,
        caseId: theCase.id,
      },
    ])
  }

  private async addMessagesForUpdatedCaseToQueue(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
  ): Promise<void> {
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
      } else if (isIndictmentCase(updatedCase.type)) {
        if (updatedCase.state === CaseState.SUBMITTED) {
          await this.addMessagesForSubmittedIndicitmentCaseToQueue(
            updatedCase,
            user,
          )
        } else if (completedCaseStates.includes(updatedCase.state)) {
          // Indictment cases are not signed
          await this.addMessagesForCompletedIndictmentCaseToQueue(
            updatedCase,
            user,
          )
        }
      }
    }

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
      }
    }

    if (
      updatedCase.prosecutorStatementDate?.getTime() !==
      theCase.prosecutorStatementDate?.getTime()
    ) {
      await this.addMessagesForAppealStatementToQueue(updatedCase, user)
    }

    if (isRestrictionCase(updatedCase.type)) {
      if (
        updatedCase.caseModifiedExplanation !== theCase.caseModifiedExplanation
      ) {
        // Case to dates modified
        await this.addMessagesForModifiedCaseToQueue(updatedCase, user)
      }
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
          } as CreateCaseDto,
          transaction,
        )

        await this.defendantService.createForNewCase(caseId, {}, transaction)

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async update(
    theCase: Case,
    update: UpdateCase,
    user: TUser,
    returnUpdatedCase = true,
  ): Promise<Case | undefined> {
    const receivingCase =
      update.courtCaseNumber && theCase.state === CaseState.SUBMITTED

    return this.sequelize
      .transaction(async (transaction) => {
        if (receivingCase) {
          update.state = transitionCase(
            CaseTransition.RECEIVE,
            theCase.state,
            theCase.appealState,
          ).state
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

      await this.addMessagesForCompletedCaseToQueue(theCase, user)

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
