import { option } from 'fp-ts'
import { filterMap } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import pick from 'lodash/pick'
import { Includeable, literal, Op, Transaction } from 'sequelize'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

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
  addMessagesToQueue,
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
  CourtSessionStringType,
  DateType,
  dateTypes,
  defendantEventTypes,
  EventType,
  eventTypes,
  IndictmentCaseNotificationType,
  IndictmentDecision,
  isCompletedCase,
  isIndictmentCase,
  isInvestigationCase,
  isRequestCase,
  isRestrictionCase,
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
import { DefendantService } from '../defendant'
import { EventService } from '../event'
import { EventLogService } from '../event-log'
import { FileService } from '../file'
import { IndictmentCountService } from '../indictment-count'
import {
  Case,
  caseInclude,
  CaseRepositoryService,
  CaseString,
  CourtDocumentRepositoryService,
  CourtSessionRepositoryService,
  DateLog,
  Defendant,
  DefendantEventLog,
  EventLog,
  Institution,
  Subpoena,
  UpdateCase,
  User,
  Verdict,
} from '../repository'
import { SubpoenaService } from '../subpoena'
import { VerdictService } from '../verdict'
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
  'postponedIndefinitelyExplanation' | 'civilDemands' | 'penalties'
>

const caseStringTypes: Record<CaseStringKeys, StringType> = {
  postponedIndefinitelyExplanation:
    StringType.POSTPONED_INDEFINITELY_EXPLANATION,
  civilDemands: StringType.CIVIL_DEMANDS,
  penalties: StringType.PENALTIES,
}

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
        as: 'verdicts',
        required: false,
        order: [['created', 'DESC']],
        separate: true,
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
    @InjectModel(DateLog) private readonly dateLogModel: typeof DateLog,
    @InjectModel(CaseString)
    private readonly caseStringModel: typeof CaseString,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    @Inject(forwardRef(() => DefendantService))
    private readonly defendantService: DefendantService,
    private readonly indictmentCountService: IndictmentCountService,
    private readonly subpoenaService: SubpoenaService,
    @Inject(forwardRef(() => VerdictService))
    private readonly verdictService: VerdictService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    private readonly eventLogService: EventLogService,
    private readonly courtDocumentRepositoryService: CourtDocumentRepositoryService,
    private readonly courtSessionRepositoryService: CourtSessionRepositoryService,
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
    caseToCreate: Partial<Case>,
    transaction: Transaction,
  ): Promise<Case> {
    const theCase = await this.caseRepositoryService.create(
      {
        ...(isRequestCase(caseToCreate.type)
          ? { state: CaseState.NEW }
          : { state: CaseState.DRAFT, withCourtSessions: true }),
        ...caseToCreate,
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

    return theCase
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

  private addMessagesForDeliverDefendantToCourtToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    for (const defendant of theCase.defendants ?? []) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
        user,
        caseId: theCase.id,
        elementId: defendant.id,
      })
    }
  }

  private addMessagesForDeliverProsecutorToCourtToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
      user,
      caseId: theCase.id,
    })
  }

  private addMessagesForDeliverAssignedRolesToCourtOfAppealsToQueue(
    user: TUser,
    theCase: Case,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
      user,
      caseId: theCase.id,
    })
  }

  private addMessagesForSubmittedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.READY_FOR_COURT },
    })
  }

  private addMessagesForDistrictCourtJudgeAssignedToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.DISTRICT_COURT_JUDGE_ASSIGNED },
    })
  }

  private addMessagesForDistrictCourtRegistrarAssignedToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.DISTRICT_COURT_REGISTRAR_ASSIGNED },
    })
  }

  private addMessagesForPublicProsecutorReviewerAssignedToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: {
        type: CaseNotificationType.PUBLIC_PROSECUTOR_REVIEWER_ASSIGNED,
      },
    })
  }

  private addMessagesForReceivedCaseToQueue(theCase: Case, user: TUser): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.RECEIVED_BY_COURT },
    })

    if (isIndictmentCase(theCase.type)) {
      if (theCase.splitCaseId) {
        addMessagesToQueue({
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId: theCase.id,
          body: {
            type: IndictmentCaseNotificationType.INDICTMENT_SPLIT_COMPLETED,
          },
        })
      }

      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_INFO,
        user,
        caseId: theCase.id,
      })

      if (theCase.origin === CaseOrigin.LOKE) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_POLICE_INDICTMENT,
          user,
          caseId: theCase.id,
        })
        theCase.policeCaseNumbers.forEach((policeCaseNumber) =>
          addMessagesToQueue({
            type: MessageType.DELIVERY_TO_POLICE_CASE_FILES_RECORD,
            user,
            caseId: theCase.id,
            elementId: policeCaseNumber,
          }),
        )
      }
    }
  }

  private addMessagesForIndictmentCourtRoleAssigned(
    theCase: Case,
    user: TUser,
    assignedNationalId: string,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES,
      user,
      caseId: theCase.id,
      elementId: assignedNationalId,
    })
  }

  private addMessagesForIndictmentArraignmentDate(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_INDICTMENT_ARRAIGNMENT_DATE,
      user,
      caseId: theCase.id,
    })
  }

  private addMessagesForCourtCaseConnectionToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_REQUEST,
      user,
      caseId: theCase.id,
    })
    this.addMessagesForDeliverProsecutorToCourtToQueue(theCase, user)
    this.addMessagesForDeliverDefendantToCourtToQueue(theCase, user)
  }

  private addMessagesForIndictmentCourtCaseConnectionToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    for (const policeCaseNumber of theCase.policeCaseNumbers) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_COURT_CASE_FILES_RECORD,
        user,
        caseId: theCase.id,
        elementId: policeCaseNumber,
      })
    }

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

    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.isKeyAccessible &&
        caseFile.category &&
        caseFilesCategories.includes(caseFile.category)
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_INDICTMENT,
      user,
      caseId: theCase.id,
    })

    for (const defendant of theCase.defendants ?? []) {
      for (const subpoena of defendant.subpoenas ?? []) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [defendant.id, subpoena.id],
        })

        const hasSubpoenaBeenSuccessfullyServedToDefendant =
          subpoena?.serviceStatus &&
          [
            ServiceStatus.DEFENDER,
            ServiceStatus.ELECTRONICALLY,
            ServiceStatus.IN_PERSON,
          ].includes(subpoena.serviceStatus)

        // Only send certificates for subpoenas which have been successfully served
        if (hasSubpoenaBeenSuccessfullyServedToDefendant) {
          addMessagesToQueue({
            type: MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE,
            user,
            caseId: theCase.id,
            elementId: [defendant.id, subpoena.id],
          })
        }
      }
    }

    if (theCase.state === CaseState.WAITING_FOR_CANCELLATION) {
      addMessagesToQueue({
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
  }

  private addMessagesForDefenderEmailChangeToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    this.addMessagesForDeliverDefendantToCourtToQueue(theCase, user)
  }

  private addMessagesForProsecutorChangeToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    this.addMessagesForDeliverProsecutorToCourtToQueue(theCase, user)
  }

  private addMessagesForSignedCourtRecordToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    if (
      theCase.origin === CaseOrigin.LOKE &&
      isInvestigationCase(theCase.type)
    ) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_POLICE_SIGNED_COURT_RECORD,
        user,
        caseId: theCase.id,
      })
    }

    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_SIGNED_COURT_RECORD,
      user,
      caseId: theCase.id,
    })
  }

  private addMessagesForSignedRulingToQueue(theCase: Case, user: TUser): void {
    addMessagesToQueue(
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
    )

    if (theCase.origin === CaseOrigin.LOKE) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_POLICE_SIGNED_RULING,
        user,
        caseId: theCase.id,
      })
    }
  }

  private addMessagesForCompletedCaseToQueue(theCase: Case, user: TUser): void {
    addMessagesToQueue(
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
    )

    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.isKeyAccessible &&
        // In restriction and investigation cases, ordinary case files do not have a category.
        // We should consider migrating all existing case files to have a category in the database.
        !caseFile.category
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    if (theCase.origin === CaseOrigin.LOKE) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_POLICE_CASE,
        user,
        caseId: theCase.id,
      })
    }

    // kept as part of the ruling case notification type since this is a court decision to complete the case with no ruling
    if (theCase.isCompletedWithoutRuling) {
      addMessagesToQueue({
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.RULING },
      })
    }
  }

  private addMessagesForCompletedIndictmentCaseToQueue(
    updatedCase: Case,
    user: TUser,
  ): void {
    for (const caseFile of updatedCase.caseFiles ?? []) {
      if (
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.key &&
        caseFile.category &&
        [CaseFileCategory.COURT_RECORD, CaseFileCategory.RULING].includes(
          caseFile.category,
        )
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: updatedCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: updatedCase.id,
      body: { type: CaseNotificationType.RULING },
    })

    if (updatedCase.withCourtSessions) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_COURT_COURT_RECORD,
        user,
        caseId: updatedCase.id,
      })
    }

    if (updatedCase.origin === CaseOrigin.LOKE) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_POLICE_INDICTMENT_CASE,
        user,
        caseId: updatedCase.id,
      })
    }
  }

  private addMessagesForModifiedCaseToQueue(theCase: Case, user: TUser): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.MODIFIED },
    })

    if (theCase.origin === CaseOrigin.LOKE) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_POLICE_CASE,
        user,
        caseId: theCase.id,
      })
    }
  }

  private addMessagesForRevokeNotificationToQueue(
    user: TUser,
    theCase: Case,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.REVOKED },
    })
  }

  private addMessagesForDeletedCaseToQueue(theCase: Case, user: TUser): void {
    this.addMessagesForRevokeNotificationToQueue(user, theCase)
  }

  private async addMessagesForRevokedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): Promise<void> {
    this.addMessagesForRevokeNotificationToQueue(user, theCase)

    if (theCase.courtCaseNumber) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE,
        user,
        caseId: theCase.id,
        body: { withCourtCaseNumber: true },
      })
    }

    // TODO: Use subpoenas already included in theCase.defendants
    // - no need to call the subpoena service
    // - we should also include split case subpoenas, which were created before the split
    // -    or, the alternatively those subpoenas should be revoked on split
    const subpoenasToRevoke = await this.subpoenaService.findByCaseId(
      theCase.id,
    )

    if (subpoenasToRevoke?.length > 0) {
      addMessagesToQueue(
        ...subpoenasToRevoke.map((subpoena) => ({
          type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA_REVOCATION,
          user,
          caseId: theCase.id,
          elementId: [subpoena.defendantId, subpoena.id],
        })),
      )
    }
  }

  private addMessagesForAppealedCaseToQueue(theCase: Case, user: TUser): void {
    // If case was appealed in court we don't need to send these messages
    if (
      theCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
      theCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL
    ) {
      return
    }

    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.isKeyAccessible &&
        caseFile.category &&
        [
          CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
          CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
        ].includes(caseFile.category)
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
    })
  }

  private addMessagesForReceivedAppealCaseToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.APPEAL_RECEIVED_BY_COURT },
    })
  }

  private addMessagesForCompletedAppealCaseToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.isKeyAccessible &&
        caseFile.category &&
        caseFile.category === CaseFileCategory.APPEAL_RULING
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue(
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
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_POLICE_APPEAL,
        user,
        caseId: theCase.id,
      })
    }
  }

  private addMessagesForAppealStatementToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.APPEAL_STATEMENT },
    })
  }

  private addMessagesForAppealWithdrawnToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.APPEAL_WITHDRAWN },
    })
  }

  private addMessagesForDeniedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.INDICTMENT_DENIED },
    })
  }

  private addMessagesForReturnedIndictmentCaseToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.INDICTMENT_RETURNED },
    })
  }

  private addMessagesForNewAppealCaseNumberToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        caseFile.isKeyAccessible &&
        caseFile.category &&
        [
          CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
          CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
          CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        ].includes(caseFile.category)
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
      user,
      caseId: theCase.id,
    })

    if (this.allAppealRolesAssigned(theCase)) {
      this.addMessagesForDeliverAssignedRolesToCourtOfAppealsToQueue(
        user,
        theCase,
      )
    }
  }

  private addMessagesForAssignedAppealRolesToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    this.addMessagesForDeliverAssignedRolesToCourtOfAppealsToQueue(
      user,
      theCase,
    )
  }

  private addMessagesForNewSubpoenasToQueue(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
  ): void {
    for (const updatedDefendant of updatedCase.defendants ?? []) {
      if (
        !(
          theCase.defendants?.find(
            (defendant) => defendant.id === updatedDefendant.id,
          )?.subpoenas?.[0]?.id !== updatedDefendant.subpoenas?.[0]?.id
        ) // Only deliver new subpoenas
      ) {
        continue
      }

      if (updatedCase.origin === CaseOrigin.LOKE) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE,
          user,
          caseId: theCase.id,
          elementId: [
            updatedDefendant.id,
            updatedDefendant.subpoenas?.[0].id ?? '',
          ],
        })
      }

      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
        user,
        caseId: theCase.id,
        elementId: [
          updatedDefendant.id,
          updatedDefendant.subpoenas?.[0].id ?? '',
        ],
      })
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
        user,
        caseId: theCase.id,
        elementId: [
          updatedDefendant.id,
          updatedDefendant.subpoenas?.[0].id ?? '',
        ],
      })
    }
  }

  private addMessagesForIndictmentArraignmentCompletionToQueue(
    theCase: Case,
    user: TUser,
  ): void {
    for (const defendant of theCase.defendants ?? []) {
      for (const subpoena of defendant.subpoenas ?? []) {
        const hasSubpoenaBeenSuccessfullyServedToDefendant =
          subpoena?.serviceStatus &&
          [
            ServiceStatus.DEFENDER,
            ServiceStatus.ELECTRONICALLY,
            ServiceStatus.IN_PERSON,
          ].includes(subpoena.serviceStatus)

        // Only send certificates for subpoenas which have been successfully served
        if (hasSubpoenaBeenSuccessfullyServedToDefendant) {
          addMessagesToQueue({
            type: MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE,
            user,
            caseId: theCase.id,
            elementId: [defendant.id, subpoena.id],
          })
        }
      }
    }
  }

  private addMessagesForUpdatedCaseToQueue(
    theCase: Case,
    updatedCase: Case,
    user: TUser,
  ): void {
    const isIndictment = isIndictmentCase(updatedCase.type)

    if (updatedCase.state !== theCase.state) {
      // New case state
      if (
        updatedCase.state === CaseState.RECEIVED &&
        theCase.state === CaseState.SUBMITTED
      ) {
        // Only send messages if the case was in a SUBMITTED state - not when reopening a case
        this.addMessagesForReceivedCaseToQueue(updatedCase, user)
      } else if (updatedCase.state === CaseState.DELETED) {
        if (!isIndictment) {
          this.addMessagesForDeletedCaseToQueue(updatedCase, user)
        }
      } else if (isCompletedCase(updatedCase.state)) {
        if (isIndictment) {
          if (theCase.state !== CaseState.WAITING_FOR_CANCELLATION) {
            this.addMessagesForCompletedIndictmentCaseToQueue(updatedCase, user)
          }
        } else {
          this.addMessagesForCompletedCaseToQueue(updatedCase, user)
        }
      } else if (updatedCase.state === CaseState.SUBMITTED && isIndictment) {
        this.addMessagesForSubmittedIndictmentCaseToQueue(updatedCase, user)
      } else if (
        updatedCase.state === CaseState.DRAFT &&
        theCase.state === CaseState.WAITING_FOR_CONFIRMATION &&
        isIndictment
      ) {
        this.addMessagesForDeniedIndictmentCaseToQueue(updatedCase, user)
      } else if (
        updatedCase.state === CaseState.DRAFT &&
        theCase.state === CaseState.RECEIVED &&
        isIndictment
      ) {
        this.addMessagesForReturnedIndictmentCaseToQueue(updatedCase, user)
      } else if (updatedCase.state === CaseState.WAITING_FOR_CANCELLATION) {
        this.addMessagesForRevokedIndictmentCaseToQueue(updatedCase, user)
      }
    }

    // This only applies to restriction cases
    if (updatedCase.appealState !== theCase.appealState) {
      if (updatedCase.appealState === CaseAppealState.APPEALED) {
        this.addMessagesForAppealedCaseToQueue(updatedCase, user)
      } else if (
        theCase.appealState === CaseAppealState.APPEALED && // Do not send messages when reopening a case
        updatedCase.appealState === CaseAppealState.RECEIVED
      ) {
        this.addMessagesForReceivedAppealCaseToQueue(updatedCase, user)
      } else if (updatedCase.appealState === CaseAppealState.COMPLETED) {
        this.addMessagesForCompletedAppealCaseToQueue(updatedCase, user)
      } else if (updatedCase.appealState === CaseAppealState.WITHDRAWN) {
        this.addMessagesForAppealWithdrawnToQueue(updatedCase, user)
      }
    }

    // This only applies to restriction cases
    if (
      updatedCase.prosecutorStatementDate?.getTime() !==
      theCase.prosecutorStatementDate?.getTime()
    ) {
      this.addMessagesForAppealStatementToQueue(updatedCase, user)
    }

    // This only applies to restriction cases
    if (
      updatedCase.caseModifiedExplanation !== theCase.caseModifiedExplanation
    ) {
      // Case to dates modified
      this.addMessagesForModifiedCaseToQueue(updatedCase, user)
    }

    if (updatedCase.courtCaseNumber) {
      if (updatedCase.courtCaseNumber !== theCase.courtCaseNumber) {
        // New court case number
        if (isIndictment) {
          this.addMessagesForIndictmentCourtCaseConnectionToQueue(
            updatedCase,
            user,
          )
        } else {
          this.addMessagesForCourtCaseConnectionToQueue(updatedCase, user)
        }
      } else {
        if (
          !isIndictment &&
          updatedCase.prosecutorId !== theCase.prosecutorId
        ) {
          // New prosecutor
          this.addMessagesForProsecutorChangeToQueue(updatedCase, user)
        }

        if (
          !isIndictment &&
          updatedCase.defenderEmail !== theCase.defenderEmail
        ) {
          // New defender email
          this.addMessagesForDefenderEmailChangeToQueue(updatedCase, user)
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
        this.addMessagesForDistrictCourtJudgeAssignedToQueue(updatedCase, user)
      }

      if (isRegistrarChanged) {
        this.addMessagesForDistrictCourtRegistrarAssignedToQueue(
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
        this.addMessagesForIndictmentCourtRoleAssigned(
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
        this.addMessagesForNewAppealCaseNumberToQueue(updatedCase, user)
      } else if (
        this.allAppealRolesAssigned(updatedCase) &&
        (updatedCase.appealAssistantId !== theCase.appealAssistantId ||
          updatedCase.appealJudge1Id !== theCase.appealJudge1Id ||
          updatedCase.appealJudge2Id !== theCase.appealJudge2Id ||
          updatedCase.appealJudge3Id !== theCase.appealJudge3Id)
      ) {
        // New appeal court
        this.addMessagesForAssignedAppealRolesToQueue(updatedCase, user)
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
        this.addMessagesForIndictmentArraignmentDate(updatedCase, user)
      }

      this.addMessagesForNewSubpoenasToQueue(theCase, updatedCase, user)
    }

    // This only applies to indictments and only when an arraignment has been completed
    if (updatedCase.indictmentDecision && !theCase.indictmentDecision) {
      this.addMessagesForIndictmentArraignmentCompletionToQueue(
        updatedCase,
        user,
      )
    }

    // currently public prosecutors only want to be notified about fines since they have a shorter deadline to review compared to verdicts
    if (
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE &&
      updatedCase.indictmentReviewerId &&
      updatedCase.indictmentReviewerId !== theCase.indictmentReviewerId &&
      isIndictment
    ) {
      this.addMessagesForPublicProsecutorReviewerAssignedToQueue(
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
      include: caseInclude,
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

  async getConnectedIndictmentCases(theCase: Case): Promise<Case[]> {
    if (!theCase.defendants || theCase.defendants.length === 0) {
      return []
    }

    // Build "match any of these defendants" conditions
    const defendantOrConditions = theCase.defendants.map((defendant) =>
      defendant.noNationalId
        ? { nationalId: defendant.nationalId, name: defendant.name }
        : {
            nationalId: {
              [Op.in]: normalizeAndFormatNationalId(defendant.nationalId),
            },
          },
    )

    return this.caseRepositoryService.findAll({
      include: [
        { model: Institution, as: 'court', attributes: ['id', 'name'] },
        {
          model: Defendant,
          as: 'defendants',
          required: true,
          attributes: ['id', 'noNationalId', 'nationalId', 'name'],
          // At least one matching defendant per condition
          where: { [Op.or]: defendantOrConditions },
        },
      ],
      attributes: ['id', 'courtCaseNumber'],
      where: {
        [Op.and]: {
          isArchived: false,
          type: CaseType.INDICTMENT,
          state: [CaseState.RECEIVED],
          id: { [Op.ne]: theCase.id },
        },
      },
    })
  }

  async getCandidateMergeCases(theCase: Case): Promise<Case[]> {
    if (!theCase.defendants || theCase.defendants.length === 0) {
      return []
    }

    // Build "match any of these defendants" conditions
    const defendantOrConditions = theCase.defendants.map((defendant) =>
      defendant.noNationalId
        ? { nationalId: defendant.nationalId, name: defendant.name }
        : {
            nationalId: {
              [Op.in]: normalizeAndFormatNationalId(defendant.nationalId),
            },
          },
    )

    const expectedCount = theCase.defendants.length

    return this.caseRepositoryService.findAll({
      include: [
        {
          model: Defendant,
          as: 'defendants',
          required: true,
          attributes: [],
          // At least one matching defendant per condition
          where: { [Op.or]: defendantOrConditions },
        },
      ],
      attributes: ['id', 'courtCaseNumber'],
      where: {
        [Op.and]: {
          isArchived: false,
          id: { [Op.ne]: theCase.id },
          type: CaseType.INDICTMENT,
          state: CaseState.RECEIVED,
          courtId: theCase.courtId,
        },
      },
      // Ensure all defendants matched by grouping and counting
      group: ['Case.id'],
      having: literal(`COUNT(DISTINCT "defendants"."id") = ${expectedCount}`),
    })
  }

  async create(
    caseToCreate: CreateCaseDto,
    user: TUser,
    transaction: Transaction,
  ): Promise<Case> {
    const theCase = await this.createCase(
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
      },
      transaction,
    )

    await this.defendantService.createForNewCase(theCase.id, {}, transaction)

    return this.findById(theCase.id, false, transaction)
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

  private handleStateChangeEventLogUpdatesForIndictments(
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

  private handleStateChangeEventLogUpdatesForRequest(
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

  private handleStateChangeEventLogUpdates(
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

  private async handleInitialCourtDocumentCreation(
    theCase: Case,
    transaction: Transaction,
  ) {
    const indictmentConfirmedDate = EventLog.getEventLogDateByEventType(
      EventType.INDICTMENT_CONFIRMED,
      theCase.eventLogs,
    )

    // Start with the generated indictment PDF
    await this.courtDocumentRepositoryService.create(
      theCase.id,
      {
        documentType: CourtDocumentType.GENERATED_DOCUMENT,
        name: `Ákæra${
          indictmentConfirmedDate
            ? ` ${formatDate(indictmentConfirmedDate)}`
            : ''
        }`,
        generatedPdfUri: `/api/case/${theCase.id}/indictment/Ákæra`,
      },
      { transaction },
    )

    const caseFiles = theCase.caseFiles ?? []

    // Add all criminal records
    for (const caseFile of caseFiles.filter(
      (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
    ) ?? []) {
      await this.courtDocumentRepositoryService.create(
        theCase.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        { transaction },
      )
    }

    // Add all cost breakdowns
    for (const caseFile of caseFiles.filter(
      (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
    ) ?? []) {
      await this.courtDocumentRepositoryService.create(
        theCase.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        { transaction },
      )
    }

    // Add all case files records
    for (const policeCaseNumber of theCase.policeCaseNumbers) {
      const name = `Skjalaskrá ${policeCaseNumber}`

      await this.courtDocumentRepositoryService.create(
        theCase.id,
        {
          documentType: CourtDocumentType.GENERATED_DOCUMENT,
          name,
          generatedPdfUri: `/api/case/${theCase.id}/caseFilesRecord/${policeCaseNumber}/${name}`,
        },
        { transaction },
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
      await this.courtDocumentRepositoryService.create(
        theCase.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        { transaction },
      )
    }

    for (const defendant of (theCase.defendants ?? []).filter(
      (defendant) => !defendant.isAlternativeService,
    )) {
      for (const subpoena of defendant.subpoenas ?? []) {
        const subpoenaName = `Fyrirkall ${defendant.name} ${formatDate(
          subpoena.created,
        )}`

        await this.courtDocumentRepositoryService.create(
          theCase.id,
          {
            documentType: CourtDocumentType.GENERATED_DOCUMENT,
            name: subpoenaName,
            generatedPdfUri: `/api/case/${theCase.id}/subpoena/${defendant.id}/${subpoena.id}/${subpoenaName}`,
          },
          { transaction },
        )

        const wasSubpoenaSuccessfullyServed =
          subpoena.serviceStatus &&
          [
            ServiceStatus.DEFENDER,
            ServiceStatus.ELECTRONICALLY,
            ServiceStatus.IN_PERSON,
          ].includes(subpoena.serviceStatus)

        if (!wasSubpoenaSuccessfullyServed) {
          continue
        }

        const certificateName = `Birtingarvottorð ${defendant.name}`

        await this.courtDocumentRepositoryService.create(
          theCase.id,
          {
            documentType: CourtDocumentType.GENERATED_DOCUMENT,
            name: certificateName,
            generatedPdfUri: `/api/case/${theCase.id}/subpoenaServiceCertificate/${defendant.id}/${subpoena.id}/${certificateName}`,
          },
          { transaction },
        )
      }
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
      return this.eventLogService.createWithUser(
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
      return this.handleEventLogUpdatesForIndictments(
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
    transaction: Transaction,
    returnUpdatedCase = true,
  ): Promise<Case | undefined> {
    const isReceivingCase =
      update.courtCaseNumber && theCase.state === CaseState.SUBMITTED

    const shouldCreateCourtDocuments =
      isIndictmentCase(theCase.type) &&
      theCase.withCourtSessions &&
      ((update.state === CaseState.SUBMITTED &&
        theCase.state === CaseState.WAITING_FOR_CONFIRMATION) ||
        // The following is a temporary measure
        // Currently, court documents are created when receiving a case,
        // so when this change is deployed, there may be some already submitted cases
        // which have not been given the chance to have court documents created
        (isReceivingCase &&
          !theCase.courtSessions?.length &&
          !theCase.unfiledCourtDocuments?.length))

    const completingIndictmentCase =
      isIndictmentCase(theCase.type) &&
      update.state === CaseState.COMPLETED &&
      // Not true when closing again after correcting an indictment case
      theCase.state !== CaseState.CORRECTING

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

    // Handle court document creation on submitting an indictment case to court
    if (shouldCreateCourtDocuments && theCase.withCourtSessions) {
      await this.handleInitialCourtDocumentCreation(theCase, transaction)
    }

    // Create new subpoenas if scheduling a new arraignment date for an indictment case
    if (schedulingNewArraignmentDateForIndictmentCase && theCase.defendants) {
      const dsPairs = await Promise.all(
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

            return { defendant, subpoena }
          }),
      )

      // Add court documents if a court session exists
      if (
        theCase.withCourtSessions &&
        theCase.courtSessions &&
        theCase.courtSessions.length > 0
      ) {
        for (const { defendant, subpoena } of dsPairs) {
          const name = `Fyrirkall ${defendant.name} ${formatDate(
            subpoena.created,
          )}`

          await this.courtDocumentRepositoryService.create(
            theCase.id,
            {
              documentType: CourtDocumentType.GENERATED_DOCUMENT,
              name,
              generatedPdfUri: `/api/case/${theCase.id}/subpoena/${defendant.id}/${subpoena.id}/${name}`,
            },
            { transaction },
          )
        }
      }
    }

    // Ensure that verdicts exist at this stage, if they don't exist we create them
    if (completingIndictmentCaseWithRuling && theCase.defendants) {
      await Promise.all(
        theCase.defendants.map((defendant) => {
          if (!defendant.verdicts || defendant.verdicts.length === 0) {
            return this.verdictService.createVerdict(
              theCase.id,
              { defendantId: defendant.id },
              transaction,
            )
          }
        }),
      )
    }

    // if ruling decision is changed to other decision
    // we have to clean up idle verdicts
    const hasNewDecision =
      theCase.indictmentDecision === IndictmentDecision.COMPLETING &&
      !!update.indictmentDecision &&
      [
        IndictmentDecision.POSTPONING,
        IndictmentDecision.POSTPONING_UNTIL_VERDICT,
        IndictmentDecision.REDISTRIBUTING,
        IndictmentDecision.SCHEDULING,
      ].includes(update.indictmentDecision)

    const hasNewRulingDecision =
      theCase.indictmentRulingDecision ===
        CaseIndictmentRulingDecision.RULING &&
      !!update.indictmentRulingDecision &&
      [
        CaseIndictmentRulingDecision.CANCELLATION,
        CaseIndictmentRulingDecision.FINE,
        CaseIndictmentRulingDecision.DISMISSAL,
        CaseIndictmentRulingDecision.MERGE,
        CaseIndictmentRulingDecision.WITHDRAWAL,
      ].includes(update.indictmentRulingDecision)

    if (theCase.defendants && (hasNewDecision || hasNewRulingDecision)) {
      await Promise.all(
        theCase.defendants.flatMap((defendant) =>
          pipe(
            defendant.verdicts ?? [],
            filterMap((verdict) => {
              if (verdict) {
                return option.some(
                  this.verdictService.deleteVerdict(verdict, transaction),
                )
              }

              return option.none
            }),
          ),
        ),
      )
    }

    // Remove uploaded ruling files if an indictment case is completed without a ruling
    if (completingIndictmentCaseWithoutRuling && theCase.caseFiles) {
      await Promise.all(
        theCase.caseFiles
          .filter((caseFile) => caseFile.category === CaseFileCategory.RULING)
          .map((caseFile) =>
            this.fileService.deleteCaseFile(theCase, caseFile, transaction),
          ),
      )
    }

    if (
      completingIndictmentCase &&
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.MERGE &&
      theCase.mergeCaseId
    ) {
      const parentCase = theCase.mergeCase

      if (parentCase?.state !== CaseState.RECEIVED) {
        throw new BadRequestException(
          `Cannot merge indictment case ${theCase.id} with parent case ${
            parentCase?.id ?? 'unknown'
          } in state ${parentCase?.state ?? 'unknown'}`,
        )
      }

      // Update the latest court session if it is unconfirmed
      if (
        parentCase.withCourtSessions &&
        parentCase.courtSessions &&
        parentCase.courtSessions.length > 0 &&
        !parentCase.courtSessions[parentCase.courtSessions.length - 1]
          .isConfirmed
      ) {
        await this.courtSessionRepositoryService.addMergedCaseToLatestCourtSession(
          parentCase.id,
          theCase.id,
          { transaction },
        )
      }
    }

    const updatedCase = await this.findById(theCase.id, true, transaction)

    await this.handleEventLogUpdates(theCase, updatedCase, user, transaction)

    this.addMessagesForUpdatedCaseToQueue(theCase, updatedCase, user)

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
  }

  async requestCourtRecordSignature(
    theCase: Case,
    user: TUser,
    method: 'audkenni' | 'mobile',
  ): Promise<SigningServiceResponse> {
    await this.refreshFormatMessage()

    const pdf = await getCourtRecordPdfAsString(theCase, this.formatMessage)

    if (method === 'audkenni') {
      return this.signingService
        .requestSignatureAudkenni(
          user.nationalId,
          user.name,
          'Ísland',
          'courtRecord.pdf',
          pdf,
          'Undirrita skjal - Öryggistala',
        )
        .catch((error) => {
          this.eventService.postErrorEvent(
            `Failed to request a court record signature via ${method}`,
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
          `Failed to request a court record signature via ${method}`,
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
    method: 'audkenni' | 'mobile',
    transaction: Transaction,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestCourtRecordSignature
    try {
      const courtRecordPdf = await this.signingService.waitForSignature(
        'courtRecord.pdf',
        documentToken,
        method,
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
        transaction,
        false,
      )

      await this.addMessagesForSignedCourtRecordToQueue(theCase, user)

      return { documentSigned: true }
    } catch (error) {
      this.eventService.postErrorEvent(
        `Failed to get a court record signature confirmation via ${method}`,
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
          courtCaseNumber: theCase.courtCaseNumber,
          actor: user.name,
          institution: user.institution?.name,
        },
        error,
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

  async requestRulingSignature(
    theCase: Case,
    method: 'audkenni' | 'mobile',
  ): Promise<SigningServiceResponse> {
    const judge = theCase.judge
    if (!judge) {
      throw new InternalServerErrorException(
        'Failed to request a ruling signature - judge not found',
      )
    }

    await this.refreshFormatMessage()
    const pdf = await getRulingPdfAsString(theCase, this.formatMessage)
    if (method === 'audkenni') {
      return this.signingService
        .requestSignatureAudkenni(
          judge.nationalId,
          judge.name,
          'Ísland',
          'ruling.pdf',
          pdf,
          'Undirrita skjal - Öryggistala',
        )
        .catch((error) => {
          this.eventService.postErrorEvent(
            `Failed to request a ruling signature via ${method}`,
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

    return this.signingService
      .requestSignature(
        judge.mobileNumber,
        'Undirrita skjal - Öryggistala',
        judge.name,
        'Ísland',
        'ruling.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          `Failed to request a ruling signature via ${method}`,
          {
            caseId: theCase.id,
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: judge.name,
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
    method: 'audkenni' | 'mobile',
    transaction: Transaction,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestRulingSignature
    try {
      const signedPdf = await this.signingService.waitForSignature(
        'ruling.pdf',
        documentToken,
        method,
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
        transaction,
        false,
      )

      this.addMessagesForSignedRulingToQueue(theCase, user)

      return { documentSigned: true }
    } catch (error) {
      this.eventService.postErrorEvent(
        `Failed to get a ruling signature confirmation via ${method}`,
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
          courtCaseNumber: theCase.courtCaseNumber,
          actor: user.name,
          institution: user.institution?.name,
        },
        error,
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

  async extend(
    theCase: Case,
    user: TUser,
    transaction: Transaction,
  ): Promise<Case> {
    const copiedExtendRestrictionCaseFields: (keyof Case)[] = [
      'origin',
      'type',
      'description',
      'policeCaseNumbers',
      'defenderName',
      'defenderNationalId',
      'defenderEmail',
      'defenderPhoneNumber',
      'leadInvestigator',
      'courtId',
      'translator',
      'lawsBroken',
      'legalBasis',
      'legalProvisions',
      'requestedCustodyRestrictions',
      'caseFacts',
      'legalArguments',
      'requestProsecutorOnlySession',
      'prosecutorOnlySessionRequest',
      'policeDefendantNationalId',
    ]

    const copiedExtendInvestigationCaseFields: (keyof Case)[] = [
      ...copiedExtendRestrictionCaseFields,
      'demands',
    ]

    const extendedCase = await this.createCase(
      {
        ...(isRestrictionCase(theCase.type)
          ? pick(theCase, copiedExtendRestrictionCaseFields)
          : pick(theCase, copiedExtendInvestigationCaseFields)),
        parentCaseId: theCase.id,
        initialRulingDate: theCase.initialRulingDate ?? theCase.rulingDate,
        creatingProsecutorId: user.id,
        prosecutorId: user.id,
        prosecutorsOfficeId: user.institution?.id,
      },
      transaction,
    )

    if (theCase.defendants && theCase.defendants?.length > 0) {
      await Promise.all(
        theCase.defendants?.map((defendant) =>
          this.defendantService.createForNewCase(
            extendedCase.id,
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

    return extendedCase
  }

  async splitDefendantFromCase(
    theCase: Case,
    defendant: Defendant,
    transaction: Transaction,
  ): Promise<Case> {
    const splitCase = await this.caseRepositoryService.split(
      theCase.id,
      defendant.id,
      { transaction },
    )

    const fullSplitCase = await this.findById(splitCase.id, false, transaction)

    await this.handleInitialCourtDocumentCreation(fullSplitCase, transaction)

    return splitCase
  }

  async createCourtCase(
    theCase: Case,
    user: TUser,
    transaction: Transaction,
  ): Promise<Case> {
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

    const updatedCase = await this.update(
      theCase,
      { courtCaseNumber },
      user,
      transaction,
      true,
    )

    return updatedCase as Case
  }
}
