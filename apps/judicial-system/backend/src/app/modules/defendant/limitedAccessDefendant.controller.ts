import { Response } from 'express'

import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases, SubpoenaType } from '@island.is/judicial-system/types'

import { defenderRule } from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { Defendant } from './models/defendant.model'

@Controller('api/case/:caseId/limitedAccess/defendant/:defendantId/subpoena')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseReadGuard,
  DefendantExistsGuard,
)
@ApiTags('limited access defendants')
export class LimitedAccessDefendantController {
  constructor(
    private readonly pdfService: PdfService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(defenderRule)
  @Get()
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the subpoena for a given defendant as a pdf document',
  })
  async getSubpoenaPdf(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Res() res: Response,
    @Query('arraignmentDate') arraignmentDate?: Date,
    @Query('location') location?: string,
    @Query('subpoenaType') subpoenaType?: SubpoenaType,
  ): Promise<void> {
    this.logger.debug(
      `Getting the subpoena for defendant ${defendantId} of case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getSubpoenaPdf(
      theCase,
      defendant,
      arraignmentDate,
      location,
      subpoenaType,
    )

    res.end(pdf)
  }
}
