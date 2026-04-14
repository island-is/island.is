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

import { CurrentCase } from '../case/guards/case.decorator'
import { CaseCompletedGuard } from '../case/guards/caseCompleted.guard'
import { CaseTypeGuard } from '../case/guards/caseType.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../case/guards/limitedAccessCaseExists.guard'
import { EventService } from '../event'
import { AppealCase, Case } from '../repository'
import { TransitionAppealCaseDto } from './dto/transitionAppealCase.dto'
import { UpdateAppealCaseDto } from './dto/updateAppealCase.dto'
import { CurrentAppealCase } from './guards/appealCase.decorator'
import { AppealCaseExistsGuard } from './guards/appealCaseExists.guard'
import {
  defenderCreateRule,
  defenderTransitionRule,
  defenderUpdateRule,
} from './guards/rolesRules'
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
    CaseCompletedGuard,
  )
  @RolesRules(defenderCreateRule)
  @Post('case/:caseId/limitedAccess/appealCase')
  @ApiCreatedResponse({
    type: AppealCase,
    description: 'Creates a new appeal case for limited access user',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating limited access appeal case for case ${caseId}`)

    const appealCase = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.create(theCase, user, transaction),
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
  @RolesRules(defenderUpdateRule)
  @Patch('case/:caseId/limitedAccess/appealCase/:appealCaseId')
  @ApiOkResponse({
    type: AppealCase,
    description: 'Updates an existing appeal case',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() updateDto: UpdateAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(`Updating appeal case ${appealCaseId} of case ${caseId}`)

    return this.sequelize.transaction((transaction) =>
      this.appealCaseService.update(appealCase, updateDto, user, transaction),
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
    CaseCompletedGuard,
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
    @Body() dto: TransitionAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Transitioning limited access appeal case ${appealCaseId} of case ${caseId}`,
    )

    const result = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.transition(
        appealCaseId,
        theCase,
        dto.transition,
        transaction,
      ),
    )

    this.eventService.postEvent(dto.transition, theCase)

    return result.appealCase
  }
}
