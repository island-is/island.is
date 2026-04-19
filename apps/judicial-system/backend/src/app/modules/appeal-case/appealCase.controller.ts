import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  ForbiddenException,
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
import { UserRole } from '@island.is/judicial-system/types'

import { prosecutorRepresentativeRule, prosecutorRule } from '../../guards'
import { CurrentCase } from '../case/guards/case.decorator'
import { CaseExistsGuard } from '../case/guards/caseExists.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { EventService } from '../event'
import { AppealCase, Case } from '../repository'
import { UserService } from '../user'
import { TransitionAppealCaseDto } from './dto/transitionAppealCase.dto'
import { UpdateAppealCaseDto } from './dto/updateAppealCase.dto'
import { CurrentAppealCase } from './guards/appealCase.decorator'
import { AppealCaseExistsGuard } from './guards/appealCaseExists.guard'
import {
  courtOfAppealsAssistantTransitionRule,
  courtOfAppealsAssistantUpdateRule,
  courtOfAppealsJudgeTransitionRule,
  courtOfAppealsJudgeUpdateRule,
  courtOfAppealsRegistrarTransitionRule,
  courtOfAppealsRegistrarUpdateRule,
  districtCourtJudgeTransitionRule,
  districtCourtRegistrarTransitionRule,
  prosecutorRepresentativeTransitionRule,
  prosecutorRepresentativeUpdateRule,
  prosecutorTransitionRule,
  prosecutorUpdateRule,
} from './guards/rolesRules'
import { AppealCaseService } from './appealCase.service'

@Controller('api')
@ApiTags('appeal cases')
@UseGuards(JwtAuthUserGuard)
export class AppealCaseController {
  constructor(
    private readonly appealCaseService: AppealCaseService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async validateAssignedUser(
    assignedUserId: string,
    assignableUserRoles: UserRole[],
  ) {
    const assignedUser = await this.userService.findById(assignedUserId)

    if (!assignableUserRoles.includes(assignedUser.role)) {
      throw new ForbiddenException(
        `User ${assignedUserId} does not have an acceptable role ${assignableUserRoles}`,
      )
    }
  }

  @UseGuards(CaseExistsGuard, RolesGuard, CaseWriteGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post('case/:caseId/appealCase')
  @ApiCreatedResponse({
    type: AppealCase,
    description: 'Creates a new appeal case',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating appeal case for case ${caseId}`)

    const appealCase = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.create(theCase, user, transaction),
    )

    this.eventService.postEvent('CREATE_APPEAL', theCase)

    return appealCase
  }

  @UseGuards(CaseExistsGuard, AppealCaseExistsGuard, RolesGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorUpdateRule,
    prosecutorRepresentativeUpdateRule,
    courtOfAppealsJudgeUpdateRule,
    courtOfAppealsRegistrarUpdateRule,
    courtOfAppealsAssistantUpdateRule,
  )
  @Patch('case/:caseId/appealCase/:appealCaseId')
  @ApiOkResponse({
    type: AppealCase,
    description: 'Updates an existing appeal case',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() updateDto: UpdateAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(`Updating appeal case ${appealCaseId} of case ${caseId}`)

    if (updateDto.appealAssistantId) {
      await this.validateAssignedUser(updateDto.appealAssistantId, [
        UserRole.COURT_OF_APPEALS_ASSISTANT,
      ])
    }

    if (updateDto.appealJudge1Id) {
      await this.validateAssignedUser(updateDto.appealJudge1Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    if (updateDto.appealJudge2Id) {
      await this.validateAssignedUser(updateDto.appealJudge2Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    if (updateDto.appealJudge3Id) {
      await this.validateAssignedUser(updateDto.appealJudge3Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    return this.sequelize.transaction((transaction) =>
      this.appealCaseService.update(
        theCase,
        appealCase,
        updateDto,
        user,
        transaction,
      ),
    )
  }

  @UseGuards(CaseExistsGuard, AppealCaseExistsGuard, RolesGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorTransitionRule,
    prosecutorRepresentativeTransitionRule,
    districtCourtJudgeTransitionRule,
    districtCourtRegistrarTransitionRule,
    courtOfAppealsJudgeTransitionRule,
    courtOfAppealsRegistrarTransitionRule,
    courtOfAppealsAssistantTransitionRule,
  )
  @Patch('case/:caseId/appealCase/:appealCaseId/state')
  @ApiOkResponse({
    type: AppealCase,
    description: 'Transitions an appeal case to a new state',
  })
  async transition(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() dto: TransitionAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Transitioning appeal case ${appealCaseId} of case ${caseId}`,
    )

    const result = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.transition(
        appealCaseId,
        theCase,
        dto.transition,
        user,
        transaction,
      ),
    )

    this.eventService.postEvent(dto.transition, theCase)

    return result.appealCase
  }
}
