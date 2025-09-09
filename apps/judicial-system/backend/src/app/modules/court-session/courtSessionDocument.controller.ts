import { Sequelize } from 'sequelize-typescript'

import {
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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

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
import { CourtSessionDocument } from '../repository'
import { CreateCourtSessionDocumentDto } from './dto/createCourtSessionDocument.dto'
import { UpdateCourtSessionDocumentDto } from './dto/updateCourtSessionDocument.dto'
import { CourtSessionDocumentExistsGuard } from './guards/courtSessionDocumentExists.guard'
import { CourtSessionExistsGuard } from './guards/courtSessionExists.guard'
import { CourtSessionDocumentService } from './courtSessionDocument.service'

@Controller('api/case/:caseId/courtSession/:courtSessionId/document')
@ApiTags('court-session-documents')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class CourtSessionDocumentController {
  constructor(
    private readonly courtSessionDocumentService: CourtSessionDocumentService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseWriteGuard, CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: CourtSessionDocument,
    description: 'Creates a new court session document',
  })
  async create(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Body() createCourtSessionDocumentDto: CreateCourtSessionDocumentDto,
  ): Promise<CourtSessionDocument> {
    this.logger.debug(
      `Creating a new court session document for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.sequelize.transaction(async (transaction) =>
      this.courtSessionDocumentService.create(
        caseId,
        courtSessionId,
        createCourtSessionDocumentDto,
        transaction,
      ),
    )
  }

  @UseGuards(
    CaseExistsGuard,
    CaseWriteGuard,
    CourtSessionExistsGuard,
    CourtSessionDocumentExistsGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':courtSessionDocumentId')
  @ApiOkResponse({
    type: CourtSessionDocument,
    description: 'Updates a court session document',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Param('courtSessionDocumentId') courtSessionDocumentId: string,
    @Body() updateCourtSessionDocumentDto: UpdateCourtSessionDocumentDto,
  ): Promise<CourtSessionDocument> {
    this.logger.debug(
      `Updating court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.sequelize.transaction(async (transaction) =>
      this.courtSessionDocumentService.update(
        caseId,
        courtSessionId,
        courtSessionDocumentId,
        updateCourtSessionDocumentDto,
        transaction,
      ),
    )
  }

  @UseGuards(
    CaseExistsGuard,
    CaseWriteGuard,
    CourtSessionExistsGuard,
    CourtSessionDocumentExistsGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Delete(':courtSessionDocumentId')
  @ApiNoContentResponse({
    description: 'Deletes a court session document',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Param('courtSessionDocumentId') courtSessionDocumentId: string,
  ): Promise<void> {
    this.logger.debug(
      `Deleting court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.sequelize.transaction(async (transaction) =>
      this.courtSessionDocumentService.delete(
        caseId,
        courtSessionId,
        courtSessionDocumentId,
        transaction,
      ),
    )
  }
}
