import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../guards'
import { CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { Case, CourtSession, CourtSessionString } from '../repository'
import { CourtSessionStringDto } from './dto/CourtSessionStringDto.dto'
import { DeleteCourtSessionResponse } from './dto/deleteCourtSession.response'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'
import { CourtSessionExistsGuard } from './guards/courtSessionExists.guard'
import { CourtSessionService } from './courtSession.service'

@Controller('api/case/:caseId/courtSession')
@ApiTags('court-sessions')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class CourtSessionController {
  constructor(
    private readonly courtSessionService: CourtSessionService,
    @InjectConnection() private readonly sequelize: Sequelize,
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
  create(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<CourtSession> {
    this.logger.debug(`Creating a new court session for case ${caseId}`)

    return this.sequelize.transaction(async (transaction) =>
      this.courtSessionService.create(theCase, transaction),
    )
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

  @UseGuards(CaseExistsGuard, CaseWriteGuard, CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':courtSessionId/courtSessionString')
  @ApiOkResponse({
    type: CourtSessionString,
    description: 'Creates or updates a court session string',
  })
  createOrUpdateCourtSessionString(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Body() courtSessionString: CourtSessionStringDto,
  ): Promise<CourtSessionString> {
    this.logger.debug(
      `Updating court session string of ${courtSessionId} of case ${caseId}`,
    )
    return this.courtSessionService.createOrUpdateCourtSessionString({
      caseId,
      courtSessionId,
      mergedCaseId: courtSessionString.mergedCaseId,
      update: courtSessionString,
    })
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard, CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Delete(':courtSessionId')
  @ApiOkResponse({
    type: DeleteCourtSessionResponse,
    description: 'Deletes a court session',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @CurrentCase() theCase: Case,
  ): Promise<DeleteCourtSessionResponse> {
    this.logger.debug(
      `Deleting court session ${courtSessionId} of case ${caseId}`,
    )

    // Only allow users to delete the latest court session and only if there are more than one.
    const courtSessions = theCase.courtSessions
    if (
      !courtSessions ||
      courtSessions.length < 2 ||
      courtSessionId !== courtSessions[courtSessions.length - 1].id
    ) {
      throw new BadRequestException(
        `Could not delete court session ${courtSessionId} of case ${caseId}. Only the latest court session can be deleted.`,
      )
    }

    return this.sequelize.transaction(async (transaction) => {
      const deleted = await this.courtSessionService.delete(
        caseId,
        courtSessionId,
        transaction,
      )

      return { deleted }
    })
  }
}
