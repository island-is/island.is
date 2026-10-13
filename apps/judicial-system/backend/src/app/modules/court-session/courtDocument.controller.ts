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
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
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

// Every route here changes the case's court documents, and each decides what
// to change from the case the guard loaded: the routes that name a session
// find it and the document in theCase.courtSessions, fileInCourtSession finds
// the document in theCase.unfiledCourtDocuments and checks the target session
// against theCase.courtSessions. CaseExistsForUpdateGuard reads the case under
// FOR UPDATE in the request's transaction, so two of these requests on one
// case serialize on the case row and the second sees the first's commit - a
// document cannot be filed into a session that a concurrent request has just
// deleted, nor updated and removed from the record at the same time.
//
// RolesGuard runs first, ahead of the guard that takes the write lock. It
// can, because every route's three rules are bare user roles with no
// canActivate: none of them reads request.case, so a caller this controller
// has no rule for is turned away before any case row is locked.
// courtDocumentRolesRules.spec.ts pins that assumption, so a rule that starts
// reading the case cannot silently reopen the exposure.
//
// The guards after the locking read all decide from request.case and so see
// the locked row - CourtSessionExistsGuard and UnfiledCourtDocumentExistsGuard
// directly, FiledCourtDocumentExistsGuard through the session the former
// resolved.
@Controller('api/case/:caseId')
@ApiTags('court-documents')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
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

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtDocumentService.createInCourtSession(
      caseId,
      courtSessionId,
      { ...createDto, documentType: CourtDocumentType.EXTERNAL_DOCUMENT },
      transaction,
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

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtDocumentService.update(
      caseId,
      courtSessionId,
      courtDocumentId,
      updateDto,
      transaction,
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

    // Decided against the locked case: the session list is the one the guard
    // read under FOR UPDATE, so a session deleted by a concurrent request is
    // not here to be filed into.
    if (
      !theCase.courtSessions?.some((cs) => cs.id === fileDto.courtSessionId)
    ) {
      throw new BadRequestException(
        `Court session ${fileDto.courtSessionId} does not belong to case ${caseId}`,
      )
    }

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtDocumentService.fileInCourtSession(
      caseId,
      courtDocumentId,
      fileDto,
      transaction,
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

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.courtDocumentService.delete(
      caseId,
      courtSessionId,
      courtDocumentId,
      transaction,
    )

    return { deleted }
  }
}
