import { Transaction } from 'sequelize'

import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseState,
  AppealCaseTransition,
  CaseIndictmentRulingDecision,
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
import { AppealCaseRepositoryService } from './appealCaseRepository.service'

@Injectable()
export class AppealCaseService {
  constructor(
    private readonly appealCaseRepositoryService: AppealCaseRepositoryService,
    @Inject(forwardRef(() => CaseRepositoryService))
    private readonly caseRepositoryService: CaseRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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

    if (isProsecutionUser(user)) {
      caseUpdate.prosecutorPostponedAppealDate = nowFactory()
    } else if (isDefenceUser(user)) {
      caseUpdate.accusedPostponedAppealDate = nowFactory()
      if (isIndictmentCase(theCase.type)) {
        appealCaseData.appealedByNationalId = user.nationalId
      }
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

    return appealCase
  }

  async update(
    appealCase: AppealCase,
    update: UpdateAppealCaseDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Updating appeal case ${appealCase.id} of case ${appealCase.caseId}`,
    )

    const data: UpdateAppealCase = { ...update }

    if (update.appealRulingModifiedHistory) {
      const existingHistory = appealCase.appealRulingModifiedHistory
        ? `${appealCase.appealRulingModifiedHistory}\n\n`
        : ''
      const today = nowFactory().toISOString()
      data.appealRulingModifiedHistory = `${existingHistory}${today} - ${user.name} ${user.title}\n\n${update.appealRulingModifiedHistory}`
    }

    return this.appealCaseRepositoryService.update(appealCase.id, data, {
      transaction,
    })
  }

  async transition(
    appealCaseId: string,
    theCase: Case,
    transition: AppealCaseTransition,
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

    return { ...result, appealCase: updatedAppealCase }
  }
}
