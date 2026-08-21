import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { defenderRule } from '../../guards'
import { CurrentCase } from '../case/guards/case.decorator'
import { CaseTypeGuard } from '../case/guards/caseType.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../case/guards/limitedAccessCaseExists.guard'
import { EventService } from '../event'
import { AppealCase, Case } from '../repository'
import { CreateAppealCaseDto } from './dto/createAppealCase.dto'
import { CreateAppealEventLogDto } from './dto/createAppealEventLog.dto'
import { TransitionAppealCaseDto } from './dto/transitionAppealCase.dto'
import { CurrentAppealCase } from './guards/appealCase.decorator'
import { AppealCaseExistsGuard } from './guards/appealCaseExists.guard'
import { defenderTransitionRule } from './guards/rolesRules'
import { AppealCaseService } from './appealCase.service'

@Controller('api')
@ApiTags('limited access appeal cases')
@UseGuards(JwtAuthUserGuard)
export class LimitedAccessAppealCaseController {
  constructor(
    private readonly appealCaseService: AppealCaseService,
    private readonly eventService: EventService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    LimitedAccessCaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard([
      ...restrictionCases,
      ...investigationCases,
      ...indictmentCases,
    ]),
    CaseWriteGuard,
  )
  @RolesRules(defenderRule)
  @Post('case/:caseId/limitedAccess/appealCase')
  @ApiCreatedResponse({
    type: AppealCase,
    description: 'Creates a new appeal case for limited access user',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() dto: CreateAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating limited access appeal case for case ${caseId}`)

    const appealCase = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.create(
        theCase,
        user,
        dto.rulingFileId,
        transaction,
      ),
    )

    this.eventService.postEvent('CREATE_APPEAL', theCase)

    return appealCase
  }

  @UseGuards(
    LimitedAccessCaseExistsGuard,
    AppealCaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  )
  @RolesRules(defenderRule)
  @Post('case/:caseId/limitedAccess/appealCase/:appealCaseId/eventLog')
  @ApiCreatedResponse({
    type: AppealCase,
    description: 'Records an appeal event and dispatches mapped side effects',
  })
  async createEventLog(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: CreateAppealEventLogDto,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Creating appeal event log ${dto.eventType} on limited access appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.sequelize.transaction((transaction) =>
      this.appealCaseService.createEventLog(
        theCase,
        appealCase,
        dto.eventType,
        user,
        transaction,
      ),
    )
  }

  @UseGuards(
    LimitedAccessCaseExistsGuard,
    AppealCaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard([
      ...restrictionCases,
      ...investigationCases,
      ...indictmentCases,
    ]),
    CaseWriteGuard,
  )
  @RolesRules(defenderTransitionRule)
  @Patch('case/:caseId/limitedAccess/appealCase/:appealCaseId/state')
  @ApiOkResponse({
    type: AppealCase,
    description: 'Transitions a limited access appeal case to a new state',
  })
  async transition(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: TransitionAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Transitioning limited access appeal case ${appealCaseId} of case ${caseId}`,
    )

    const result = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.transition(
        theCase,
        appealCase,
        dto.transition,
        user,
        transaction,
      ),
    )

    this.eventService.postEvent(dto.transition, theCase)

    return result.appealCase
  }
}
