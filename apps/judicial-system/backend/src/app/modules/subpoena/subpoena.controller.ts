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
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  indictmentCases,
  SubpoenaType,
  type User,
} from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import {
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { Case, Defendant, Subpoena } from '../repository'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import {
  SubpoenaExistsGuard,
  SubpoenaExistsOptionalGuard,
} from './guards/subpoenaExists.guard'
import { SubpoenaService } from './subpoena.service'

@Controller('api/case/:caseId/defendant/:defendantId/subpoena')
@ApiTags('subpoenas')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseReadGuard,
  DefendantExistsGuard,
)
export class SubpoenaController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly subpoenaService: SubpoenaService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtAssistantRule,
    districtCourtRegistrarRule,
  )
  @Get(':subpoenaId')
  @UseGuards(SubpoenaExistsGuard)
  @ApiOkResponse({
    type: Subpoena,
    description: 'Gets the subpoena for a given defendant',
  })
  getSubpoena(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @CurrentHttpUser() user: User,
  ): Promise<Subpoena> {
    this.logger.debug(
      `Gets subpoena ${subpoenaId} for defendant ${defendantId} of case ${caseId}`,
    )

    return this.subpoenaService.getSubpoena(theCase, defendant, subpoena, user)
  }

  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get(['', ':subpoenaId/pdf'])
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

    const pdf = await this.pdfService.getSubpoenaServiceCertificatePdf(
      theCase,
      defendant,
      subpoena,
    )

    res.end(pdf)
  }
}
