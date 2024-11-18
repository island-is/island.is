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

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases, SubpoenaType } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { Defendant } from '../defendant'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import {
  SubpoenaExistsGuard,
  SubpoenaExistsOptionalGuard,
} from './guards/subpoenaExists.guard'
import { Subpoena } from './models/subpoena.model'

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseReadGuard,
  DefendantExistsGuard,
)
@Controller('api/case/:caseId/defendant/:defendantId/subpoena')
@ApiTags('subpoenas')
export class SubpoenaController {
  constructor(
    private readonly pdfService: PdfService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get(['', ':subpoenaId'])
  @UseGuards(SubpoenaExistsOptionalGuard)
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
    @Res() res: Response,
    @CurrentSubpoena() subpoena?: Subpoena,
    @Query('arraignmentDate') arraignmentDate?: Date,
    @Query('location') location?: string,
    @Query('subpoenaType') subpoenaType?: SubpoenaType,
  ): Promise<void> {
    this.logger.debug(
      `Getting subpoena ${
        subpoenaId ?? 'draft'
      } for defendant ${defendantId} of case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getSubpoenaPdf(
      theCase,
      defendant,
      subpoena,
      arraignmentDate,
      location,
      subpoenaType,
    )

    res.end(pdf)
  }

  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get(':subpoenaId/serviceCertificate')
  @UseGuards(SubpoenaExistsGuard)
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets the service certificate for a given defendant as a pdf document',
  })
  async getServiceCertificatePdf(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting service certificate for defendant ${defendantId} in subpoena ${subpoenaId} of case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getServiceCertificatePdf(
      theCase,
      defendant,
      subpoena,
    )

    res.end(pdf)
  }
}
