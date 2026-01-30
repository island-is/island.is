import { Response } from 'express'
import { Sequelize } from 'sequelize-typescript'

import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
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
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CurrentCase,
  defenderGeneratedPdfRule,
  PdfService,
} from '../case'
import { CurrentDefendant, DefendantExistsGuard } from '../defendant'
import { Case, Defendant, Subpoena } from '../repository'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import { SubpoenaExistsGuard } from './guards/subpoenaExists.guard'

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
  SubpoenaExistsGuard,
)
export class LimitedAccessSubpoenaController {
  constructor(
    private readonly pdfService: PdfService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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

    const pdf = await this.sequelize.transaction((transaction) =>
      this.pdfService.getSubpoenaPdf(theCase, defendant, transaction, subpoena),
    )

    res.end(pdf)
  }
}
