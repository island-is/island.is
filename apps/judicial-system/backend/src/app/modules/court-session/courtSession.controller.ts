import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../guards'
import { CaseExistsGuard, CaseWriteGuard } from '../case'
import { CourtSession } from '../repository'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'
import { CourtSessionExistsGuard } from './guards/courtSessionExists.guard'
import { CourtSessionService } from './courtSession.service'

@Controller('api/case/:caseId/courtSession')
@ApiTags('court-sessions')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class CourtSessionController {
  constructor(
    private readonly courtSessionService: CourtSessionService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: CourtSession,
    description: 'Creates a new court session',
  })
  create(@Param('caseId') caseId: string): Promise<CourtSession> {
    this.logger.debug(`Creating a new court session for case ${caseId}`)

    return this.courtSessionService.create(caseId)
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard, CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':courtSessionId')
  @ApiOkResponse({
    type: CourtSession,
    description: 'Updates a court session',
  })
  update(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Body() courtSessionToUpdate: UpdateCourtSessionDto,
  ): Promise<CourtSession> {
    this.logger.debug(
      `Updating court session ${courtSessionId} of case ${caseId}`,
    )

    return this.courtSessionService.update(
      caseId,
      courtSessionId,
      courtSessionToUpdate,
    )
  }
}
