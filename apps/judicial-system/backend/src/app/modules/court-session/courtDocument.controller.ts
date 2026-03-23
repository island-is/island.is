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
  CourtDocumentType,
  indictmentCases,
} from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../guards'
import {
  CaseExistsGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { Case, CourtDocument } from '../repository'
import { CreateCourtDocumentDto } from './dto/createCourtDocument.dto'
import { DeleteCourtDocumentResponse } from './dto/deleteCourtDocument.response'
import { FileCourtDocumentInCourtSessionDto } from './dto/fileCourtDocumentInCourtSession.dto'
import { UpdateCourtDocumentDto } from './dto/updateCourtDocument.dto'
import { CourtSessionExistsGuard } from './guards/courtSessionExists.guard'
import { FiledCourtDocumentExistsGuard } from './guards/filedCourtDocumentExists.guard'
import { UnfiledCourtDocumentExistsGuard } from './guards/unfiledCourtDocumentExists.guard'
import { CourtDocumentService } from './courtDocument.service'

@Controller('api/case/:caseId')
@ApiTags('court-documents')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseWriteGuard,
)
export class CourtDocumentController {
  constructor(
    private readonly courtDocumentService: CourtDocumentService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post('courtSession/:courtSessionId/courtDocument')
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
      this.courtDocumentService.createInCourtSession(
        caseId,
        courtSessionId,
        { ...createDto, documentType: CourtDocumentType.EXTERNAL_DOCUMENT },
        transaction,
      ),
    )
  }

  @UseGuards(CourtSessionExistsGuard, FiledCourtDocumentExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch('courtSession/:courtSessionId/courtDocument/:courtDocumentId')
  @ApiOkResponse({
    type: CourtDocument,
    description: 'Updates a court document',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Param('courtDocumentId') courtDocumentId: string,
    @Body() updateDto: UpdateCourtDocumentDto,
  ): Promise<CourtDocument> {
    this.logger.debug(
      `Updating court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.sequelize.transaction(async (transaction) =>
      this.courtDocumentService.update(
        caseId,
        courtSessionId,
        courtDocumentId,
        updateDto,
        transaction,
      ),
    )
  }

  @UseGuards(UnfiledCourtDocumentExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch('courtDocument/:courtDocumentId')
  @ApiOkResponse({
    type: CourtDocument,
    description: 'Files a court document in a court session',
  })
  async fileInCourtSession(
    @Param('caseId') caseId: string,
    @Param('courtDocumentId') courtDocumentId: string,
    @CurrentCase() theCase: Case,
    @Body() fileDto: FileCourtDocumentInCourtSessionDto,
  ): Promise<CourtDocument> {
    this.logger.debug(
      `Filing court document ${courtDocumentId} in court session ${fileDto.courtSessionId} of case ${caseId}`,
    )

    if (
      !theCase.courtSessions?.some((cs) => cs.id === fileDto.courtSessionId)
    ) {
      throw new BadRequestException(
        `Court session ${fileDto.courtSessionId} does not belong to case ${caseId}`,
      )
    }

    return this.sequelize.transaction(async (transaction) =>
      this.courtDocumentService.fileInCourtSession(
        caseId,
        courtDocumentId,
        fileDto,
        transaction,
      ),
    )
  }

  @UseGuards(CourtSessionExistsGuard, FiledCourtDocumentExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Delete('courtSession/:courtSessionId/courtDocument/:courtDocumentId')
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
