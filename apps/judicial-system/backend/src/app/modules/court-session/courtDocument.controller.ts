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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { CourtDocumentType } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../guards'
import { CaseExistsGuard, CaseWriteGuard } from '../case'
import { CourtDocument } from '../repository'
import { CreateCourtDocumentDto } from './dto/createCourtDocument.dto'
import { DeleteCourtDocumentResponse } from './dto/deleteCourtDocument.response'
import { UpdateCourtDocumentDto } from './dto/updateCourtDocument.dto'
import { CourtDocumentExistsGuard } from './guards/courtDocumentExists.guard'
import { CourtSessionExistsGuard } from './guards/courtSessionExists.guard'
import { CourtDocumentService } from './courtDocument.service'

@Controller('api/case/:caseId/courtSession/:courtSessionId/courtDocument')
@ApiTags('court-documents')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class CourtDocumentController {
  constructor(
    private readonly courtDocumentService: CourtDocumentService,
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
    type: CourtDocument,
    description: 'Creates a new court document',
  })
  async create(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Body() createDto: CreateCourtDocumentDto,
  ): Promise<CourtDocument> {
    this.logger.debug(
      `Creating a new court document for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.sequelize.transaction(async (transaction) =>
      this.courtDocumentService.create(
        caseId,
        courtSessionId,
        {
          ...createDto,
          documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
        },
        transaction,
      ),
    )
  }

  @UseGuards(
    CaseExistsGuard,
    CaseWriteGuard,
    CourtSessionExistsGuard,
    CourtDocumentExistsGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':courtDocumentId')
  @ApiOkResponse({
    type: CourtDocument,
    description: 'Updates a court document',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Param('courtDocumentId') courtDocumentId: string,
    @Body() updateCourtDocumentDto: UpdateCourtDocumentDto,
  ): Promise<CourtDocument> {
    this.logger.debug(
      `Updating court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.sequelize.transaction(async (transaction) =>
      this.courtDocumentService.update(
        caseId,
        courtSessionId,
        courtDocumentId,
        updateCourtDocumentDto,
        transaction,
      ),
    )
  }

  @UseGuards(
    CaseExistsGuard,
    CaseWriteGuard,
    CourtSessionExistsGuard,
    CourtDocumentExistsGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Delete(':courtDocumentId')
  @ApiOkResponse({
    description: 'Deletes a court document',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Param('courtDocumentId') courtDocumentId: string,
  ): Promise<DeleteCourtDocumentResponse> {
    this.logger.debug(
      `Deleting court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.sequelize.transaction(async (transaction) => {
      const deleted = await this.courtDocumentService.delete(
        caseId,
        courtSessionId,
        courtDocumentId,
        transaction,
      )

      return { deleted }
    })
  }
}
