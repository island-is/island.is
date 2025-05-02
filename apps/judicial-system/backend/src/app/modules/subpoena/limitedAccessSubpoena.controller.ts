import { Response } from 'express'

import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  Case,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CurrentCase,
  defenderGeneratedPdfRule,
  PdfService,
} from '../case'
import { CurrentDefendant, Defendant, DefendantExistsGuard } from '../defendant'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import { SubpoenaExistsGuard } from './guards/subpoenaExists.guard'
import { Subpoena } from './models/subpoena.model'

@Controller([
  'api/case/:caseId/limitedAccess/defendant/:defendantId/subpoena/:subpoenaId',
])
@ApiTags('limited access subpoenas')
@UseGuards(
  JwtAuthUserGuard,
  CaseExistsGuard,
  RolesGuard,
  new CaseTypeGuard(indictmentCases),
  CaseReadGuard,
  DefendantExistsGuard,
)
export class LimitedAccessSubpoenaController {
  constructor(
    private readonly pdfService: PdfService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(SubpoenaExistsGuard)
  @RolesRules(defenderGeneratedPdfRule)
  @Get()
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the subpoena for a given defendant as a pdf document',
  })
  async getSubpoenaPdf(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting subpoena ${subpoenaId} for defendant ${defendantId} of case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getSubpoenaPdf(
      theCase,
      defendant,
      subpoena,
    )

    res.end(pdf)
  }
}
