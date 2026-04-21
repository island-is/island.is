import { Transaction } from 'sequelize'

import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseState,
  AppealCaseTransition,
  CaseAppealDecision,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseNotificationType,
  CaseOrigin,
  isDefenceUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import {
  AppealCase,
  Case,
  CaseRepositoryService,
  UpdateAppealCase,
  UpdateCase,
} from '../repository'
import { UpdateAppealCaseDto } from './dto/updateAppealCase.dto'
import {
  AppealTransitionResult,
  transitionAppealCase,
} from './state/appealCase.state'
import { appealCaseModuleConfig } from './appealCase.config'
import { AppealCaseRepositoryService } from './appealCaseRepository.service'

@Injectable()
export class AppealCaseService {
  constructor(
    private readonly appealCaseRepositoryService: AppealCaseRepositoryService,
    @Inject(forwardRef(() => CaseRepositoryService))
    private readonly caseRepositoryService: CaseRepositoryService,
    @Inject(appealCaseModuleConfig.KEY)
    private readonly config: ConfigType<typeof appealCaseModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private allAppealRolesAssigned(appealRoles: {
    appealAssistantId?: string
    appealJudge1Id?: string
    appealJudge2Id?: string
    appealJudge3Id?: string
  }): boolean {
    return Boolean(
      appealRoles.appealAssistantId &&
        appealRoles.appealJudge1Id &&
        appealRoles.appealJudge2Id &&
        appealRoles.appealJudge3Id,
    )
  }

  private addMessagesForAppealedCaseToQueue(
    theCase: Case,
    user: User,
    fileCategories: CaseFileCategory[],
  ): void {
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
        fileCategories.includes(caseFile.category)
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
    user: User,
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
    user: User,
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
    user: User,
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
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.APPEAL_WITHDRAWN },
    })
  }

  private addMessagesForNewAppealCaseNumberToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
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

    if (this.allAppealRolesAssigned(appealCase)) {
      this.addMessagesForAssignedAppealRolesToQueue(theCase, user)
    }
  }

  private addMessagesForAssignedAppealRolesToQueue(
    theCase: Case,
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
      user,
      caseId: theCase.id,
    })
  }

  async create(
    theCase: Case,
    user: User,
    transaction: Transaction,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating appeal case for case ${theCase.id}`)

    if (
      isIndictmentCase(theCase.type) &&
      theCase.indictmentRulingDecision !==
        CaseIndictmentRulingDecision.DISMISSAL
    ) {
      throw new ForbiddenException(
        'Only dismissed indictment cases can be appealed',
      )
    }

    const caseUpdate: UpdateCase = {}
    const appealCaseData: UpdateAppealCase = {
      appealState: AppealCaseState.APPEALED,
    }

    let fileCategories: CaseFileCategory[]

    if (isProsecutionUser(user)) {
      caseUpdate.prosecutorPostponedAppealDate = nowFactory()
      fileCategories = [
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
      ]
    } else if (isDefenceUser(user)) {
      caseUpdate.accusedPostponedAppealDate = nowFactory()
      if (isIndictmentCase(theCase.type)) {
        appealCaseData.appealedByNationalId = user.nationalId
      }
      fileCategories = [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
      ]
    } else {
      throw new ForbiddenException(
        `Current user cannot appeal a ${theCase.type} case`,
      )
    }

    const appealCase = await this.appealCaseRepositoryService.create(
      theCase.id,
      appealCaseData,
      { transaction },
    )

    if (Object.keys(caseUpdate).length > 0) {
      await this.caseRepositoryService.update(theCase.id, caseUpdate, {
        transaction,
      })
    }

    this.addMessagesForAppealedCaseToQueue(theCase, user, fileCategories)

    return appealCase
  }

  async update(
    theCase: Case,
    appealCase: AppealCase,
    update: UpdateAppealCaseDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Updating appeal case ${appealCase.id} of case ${theCase.id}`,
    )

    const data: UpdateAppealCase = { ...update }

    if (update.appealRulingModifiedHistory) {
      const existingHistory = appealCase.appealRulingModifiedHistory
        ? `${appealCase.appealRulingModifiedHistory}\n\n`
        : ''
      const today = nowFactory().toISOString()
      data.appealRulingModifiedHistory = `${existingHistory}${today} - ${user.name} ${user.title}\n\n${update.appealRulingModifiedHistory}`
    }

    if (update.prosecutorStatementDate) {
      data.prosecutorStatementDate = nowFactory()
    }

    if (update.defendantStatementDate) {
      data.defendantStatementDate = nowFactory()
    }

    const updatedAppealCase = await this.appealCaseRepositoryService.update(
      appealCase.id,
      data,
      { transaction },
    )

    // Queue messages for statement date changes
    if (update.prosecutorStatementDate || update.defendantStatementDate) {
      this.addMessagesForAppealStatementToQueue(theCase, user)
    }

    if (
      update.appealCaseNumber &&
      update.appealCaseNumber !== appealCase.appealCaseNumber
    ) {
      // Queue messages for new appeal case number
      this.addMessagesForNewAppealCaseNumberToQueue(theCase, appealCase, user)
    } else if (
      appealCase.appealCaseNumber &&
      this.allAppealRolesAssigned({
        appealAssistantId:
          update.appealAssistantId ?? appealCase.appealAssistantId,
        appealJudge1Id: update.appealJudge1Id ?? appealCase.appealJudge1Id,
        appealJudge2Id: update.appealJudge2Id ?? appealCase.appealJudge2Id,
        appealJudge3Id: update.appealJudge3Id ?? appealCase.appealJudge3Id,
      }) &&
      ((update.appealAssistantId &&
        update.appealAssistantId !== appealCase.appealAssistantId) ||
        (update.appealJudge1Id &&
          update.appealJudge1Id !== appealCase.appealJudge1Id) ||
        (update.appealJudge2Id &&
          update.appealJudge2Id !== appealCase.appealJudge2Id) ||
        (update.appealJudge3Id &&
          update.appealJudge3Id !== appealCase.appealJudge3Id))
    ) {
      // Queue messages for assigned roles
      this.addMessagesForAssignedAppealRolesToQueue(theCase, user)
    }

    return updatedAppealCase
  }

  async transition(
    appealCaseId: string,
    theCase: Case,
    transition: AppealCaseTransition,
    user: User,
    transaction: Transaction,
  ): Promise<AppealTransitionResult & { appealCase: AppealCase }> {
    this.logger.debug(
      `Transitioning appeal case ${appealCaseId} of case ${theCase.id} with ${transition}`,
    )

    const result = transitionAppealCase(transition, theCase)

    const updatedAppealCase = await this.appealCaseRepositoryService.update(
      appealCaseId,
      result.appealCaseUpdate,
      { transaction },
    )

    if (Object.keys(result.caseUpdate).length > 0) {
      await this.caseRepositoryService.update(theCase.id, result.caseUpdate, {
        transaction,
      })
    }

    // Queue messages based on new appeal state
    const newAppealState = result.appealCaseUpdate.appealState
    const oldAppealState = theCase.appealCase?.appealState

    if (newAppealState === AppealCaseState.RECEIVED) {
      // Only send received messages when transitioning from APPEALED (not when reopening)
      if (oldAppealState === AppealCaseState.APPEALED) {
        this.addMessagesForReceivedAppealCaseToQueue(theCase, user)
      }
    } else if (newAppealState === AppealCaseState.COMPLETED) {
      this.addMessagesForCompletedAppealCaseToQueue(theCase, user)
    } else if (newAppealState === AppealCaseState.WITHDRAWN) {
      this.addMessagesForAppealWithdrawnToQueue(theCase, user)
    }

    return { ...result, appealCase: updatedAppealCase }
  }
}
