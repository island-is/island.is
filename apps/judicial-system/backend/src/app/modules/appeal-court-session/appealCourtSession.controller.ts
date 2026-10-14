import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
} from '../../guards'
import { CurrentAppealCase } from '../appeal-case/guards/appealCase.decorator'
import { AppealCaseExistsGuard } from '../appeal-case/guards/appealCaseExists.guard'
import {
  CaseExistsGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { AppealCase, AppealCourtSession, Case } from '../repository'
import { CreateAppealCourtSessionDto } from './dto/createAppealCourtSession.dto'
import { AppealCourtSessionService } from './appealCourtSession.service'

@Controller('api/case/:caseId/appealCase/:appealCaseId/courtSession')
@ApiTags('appeal court sessions')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  AppealCaseExistsGuard,
  CaseWriteGuard,
)
export class AppealCourtSessionController {
  constructor(
    private readonly appealCourtSessionService: AppealCourtSessionService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: AppealCourtSession,
    description: 'Creates a court session in a verdict appeal',
  })
  create(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: CreateAppealCourtSessionDto,
  ): Promise<AppealCourtSession> {
    this.logger.debug(
      `Creating a court session in appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.sequelize.transaction((transaction) =>
      this.appealCourtSessionService.create(
        theCase,
        appealCase,
        dto,
        transaction,
      ),
    )
  }
}
