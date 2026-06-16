import { Transaction } from 'sequelize'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  addMessagesToQueue,
  type Message,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealDecisionPartyRole,
  CaseFileCategory,
  CourtSessionRulingType,
  IndictmentCaseNotificationType,
  type User as TUser,
} from '@island.is/judicial-system/types'

import {
  AppealDecision,
  AppealDecisionRepositoryService,
  Case,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionString,
  UpdateCourtSession,
} from '../repository'
import { CourtSessionAppealDecisionDto } from './dto/courtSessionAppealDecision.dto'
import { CourtSessionStringDto } from './dto/CourtSessionStringDto.dto'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'

@Injectable()
export class CourtSessionService {
  constructor(
    private readonly courtSessionRepositoryService: CourtSessionRepositoryService,
    private readonly appealDecisionRepositoryService: AppealDecisionRepositoryService,
    // TODO: Move to a repository service - models should only be used in repository services
    // It would be best to hide the details of the court session model from all but the backend
    @InjectModel(CourtSessionString)
    private readonly courtSessionStringModel: typeof CourtSessionString,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private addMessagesForConfirmedCourtRecordToQueue(
    caseId: string,
    courtSession: CourtSession,
    user: TUser,
  ): void {
    const messages: Message[] = [
      {
        type: MessageType.DELIVERY_TO_COURT_COURT_RECORD_WORKING_DOCUMENT,
        user,
        caseId,
      },
    ]

    // When a ruling order uploaded during the course of a case is pronounced
    // in a confirmed court session, the parties are notified about the ruling.
    if (courtSession.rulingType === CourtSessionRulingType.ORDER) {
      messages.push({
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        user,
        caseId,
        body: { type: IndictmentCaseNotificationType.RULING_ORDER_ADDED },
      })
    }

    addMessagesToQueue(...messages)
  }

  create(theCase: Case, transaction: Transaction): Promise<CourtSession> {
    return this.courtSessionRepositoryService.create(theCase.id, {
      transaction,
    })
  }

  async createOrUpdateCourtSessionString({
    caseId,
    courtSessionId,
    mergedCaseId,
    update,
    transaction,
  }: {
    caseId: string
    courtSessionId: string
    mergedCaseId?: string
    update: CourtSessionStringDto
    transaction?: Transaction
  }): Promise<CourtSessionString> {
    const courtSessionString = await this.courtSessionStringModel.findOne({
      where: {
        caseId,
        courtSessionId,
        mergedCaseId,
        stringType: update.stringType,
      },
      transaction,
    })
    if (courtSessionString) {
      const [numberOfAffectedRows, courtSessionString] =
        await this.courtSessionStringModel.update(
          { value: update.value },
          {
            where: {
              caseId,
              courtSessionId,
              mergedCaseId,
              stringType: update.stringType,
            },
            transaction,
            returning: true,
          },
        )
      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update court session string for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court session string for court session ${courtSessionId} of case ${caseId} with data:`,
          { data: Object.keys({ value: update.value }) },
        )
      }

      this.logger.debug(
        `Updated court session string for court session ${courtSessionId} of case ${caseId}`,
      )
      return courtSessionString[0]
    } else {
      const courtSessionString = await this.courtSessionStringModel.create(
        {
          caseId,
          courtSessionId,
          mergedCaseId,
          stringType: update.stringType,
          value: update.value,
        },
        {
          transaction,
        },
      )
      return courtSessionString
    }
  }

  async update(
    theCase: Case,
    existingCourtSession: CourtSession,
    update: UpdateCourtSessionDto,
    user: TUser,
    transaction: Transaction,
  ): Promise<CourtSession> {
    const normalizedUpdate = await this.validateAndNormalizeRulingFile(
      theCase,
      existingCourtSession,
      update,
    )

    const updatedCourtSession = await this.courtSessionRepositoryService.update(
      theCase.id,
      existingCourtSession.id,
      normalizedUpdate,
      { transaction },
    )

    if (!existingCourtSession.isConfirmed && updatedCourtSession.isConfirmed) {
      this.addMessagesForConfirmedCourtRecordToQueue(
        theCase.id,
        updatedCourtSession,
        user,
      )
    }

    return updatedCourtSession
  }

  private async validateAndNormalizeRulingFile(
    theCase: Case,
    existingCourtSession: CourtSession,
    update: UpdateCourtSessionDto,
  ): Promise<UpdateCourtSession> {
    const rulingTypeInUpdate = 'rulingType' in update
    const rulingFileIdInUpdate = 'rulingFileId' in update

    const effectiveRulingType = rulingTypeInUpdate
      ? update.rulingType
      : existingCourtSession.rulingType

    // Auto-clear: when the ruling type moves away from ORDER, drop any ruling file link.
    if (
      rulingTypeInUpdate &&
      update.rulingType !== CourtSessionRulingType.ORDER
    ) {
      return { ...update, rulingFileId: null }
    }

    // Validate a newly selected ruling file.
    if (rulingFileIdInUpdate && update.rulingFileId) {
      if (effectiveRulingType !== CourtSessionRulingType.ORDER) {
        throw new BadRequestException(
          'A ruling file can only be linked when the ruling type is ORDER',
        )
      }

      const caseFile = theCase.caseFiles?.find(
        (f) => f.id === update.rulingFileId,
      )

      if (!caseFile) {
        throw new NotFoundException(
          `Case file ${update.rulingFileId} of case ${theCase.id} does not exist`,
        )
      }

      if (
        caseFile.category !== CaseFileCategory.COURT_INDICTMENT_RULING_ORDER
      ) {
        throw new BadRequestException(
          'The selected file is not a court indictment ruling order',
        )
      }
    }

    // Required-at-confirm: confirming an ORDER session requires a linked file.
    const becomingConfirmed =
      update.isConfirmed === true && existingCourtSession.isConfirmed !== true

    if (
      becomingConfirmed &&
      effectiveRulingType === CourtSessionRulingType.ORDER
    ) {
      const effectiveRulingFileId = rulingFileIdInUpdate
        ? update.rulingFileId
        : existingCourtSession.rulingFileId

      if (!effectiveRulingFileId) {
        throw new BadRequestException(
          'A ruling file must be selected before an ORDER court session can be confirmed',
        )
      }
    }

    return update
  }

  // Records a party's in-court appeal decision (Ákvörðun um kæru) against the
  // ruling order pronounced in the session. The ruling file comes from the
  // session, never the client, so a decision can only attach to this case's own
  // ruling. decision/announcement are both optional - an announcement may be
  // entered before the decision radio is picked.
  async upsertAppealDecision(
    theCase: Case,
    courtSession: CourtSession,
    update: CourtSessionAppealDecisionDto,
    transaction: Transaction,
  ): Promise<AppealDecision> {
    if (
      courtSession.rulingType !== CourtSessionRulingType.ORDER ||
      !courtSession.rulingFileId
    ) {
      throw new BadRequestException(
        'Appeal decisions can only be recorded on a court session with a pronounced ruling order',
      )
    }

    this.validateAppealDecisionParty(theCase, update)

    return this.appealDecisionRepositoryService.upsert(
      {
        caseId: theCase.id,
        rulingFileId: courtSession.rulingFileId,
        partyRole: update.partyRole,
        defendantId: update.defendantId,
        civilClaimantId: update.civilClaimantId,
      },
      {
        decision: update.decision ?? null,
        announcement: update.announcement ?? null,
      },
      { transaction },
    )
  }

  private validateAppealDecisionParty(
    theCase: Case,
    update: CourtSessionAppealDecisionDto,
  ): void {
    const { partyRole, defendantId, civilClaimantId } = update

    switch (partyRole) {
      case AppealDecisionPartyRole.PROSECUTOR:
        if (defendantId || civilClaimantId) {
          throw new BadRequestException(
            'A prosecution appeal decision must not reference a defendant or civil claimant',
          )
        }
        break
      case AppealDecisionPartyRole.DEFENDANT:
        if (!defendantId || civilClaimantId) {
          throw new BadRequestException(
            'A defendant appeal decision must reference a defendant only',
          )
        }
        if (!theCase.defendants?.some((d) => d.id === defendantId)) {
          throw new NotFoundException(
            `Defendant ${defendantId} does not belong to case ${theCase.id}`,
          )
        }
        break
      case AppealDecisionPartyRole.CIVIL_CLAIMANT:
        if (!civilClaimantId || defendantId) {
          throw new BadRequestException(
            'A civil claimant appeal decision must reference a civil claimant only',
          )
        }
        if (!theCase.civilClaimants?.some((c) => c.id === civilClaimantId)) {
          throw new NotFoundException(
            `Civil claimant ${civilClaimantId} does not belong to case ${theCase.id}`,
          )
        }
        break
    }
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtSessionRepositoryService.delete(caseId, courtSessionId, {
      transaction,
    })

    return true
  }
}
