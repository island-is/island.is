import { Response } from 'express'
import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

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
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CurrentCase,
  PdfService,
} from '../case'
import {
  CurrentDefendant,
  DefendantExistsGuard,
  SplitDefendantExistsGuard,
} from '../defendant'
import { Case, Defendant, Subpoena } from '../repository'
import { CreateSubpoenasDto } from './dto/createSubpoenas.dto'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import {
  SubpoenaExistsGuard,
  SubpoenaExistsOptionalGuard,
} from './guards/subpoenaExists.guard'
import { SubpoenaService } from './subpoena.service'

// createSubpoenas decides against the case row it reads and the defendants on
// it: which defendants to summon, which earlier subpoenas to revoke, whether
// to file court documents. It reads the case under FOR UPDATE through
// CaseExistsForUpdateGuard, so the decision is made against a row no one else
// can change until the request's transaction commits.
//
// That guard cannot sit at class level: getSubpoena calls the police inside a
// transaction of its own, and the two pdf routes only read, so all three keep
// the plain CaseExistsGuard - a lock held across an external call, or taken
// for a read, is exactly what the locking guard must not do. Every route
// therefore lists its own exists guard first, and CaseTypeGuard and
// CaseReadGuard move with it: they decide from request.case, so they have to
// follow whichever guard put the case there.
//
// RolesGuard stays at class level, ahead of the locking read. It can, because
// every rule on this controller is a bare user role with no canActivate: none
// of them reads request.case, so a caller a route has no rule for is turned
// away before any case row is locked. subpoenaRolesRules.spec.ts pins the
// assumption, so a rule that starts reading the case cannot silently reopen
// the exposure.
@Controller('api/case/:caseId')
@ApiTags('subpoenas')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class SubpoenaController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly subpoenaService: SubpoenaService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post('subpoenas')
  @ApiCreatedResponse({
    type: Subpoena,
    isArray: true,
    description: 'Creates subpoenas for multiple defendants',
  })
  async createSubpoenas(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() createSubpoenasDto: CreateSubpoenasDto,
    @CurrentHttpUser() user: User,
  ): Promise<Subpoena[]> {
    this.logger.debug(
      `Creating subpoenas for defendants ${createSubpoenasDto.defendantIds.join(
        ', ',
      )} in case ${caseId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.subpoenaService.createSubpoenasForDefendants(
      createSubpoenasDto,
      transaction,
      theCase,
      user,
    )
  }

  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtAssistantRule,
    districtCourtRegistrarRule,
  )
  @Get('defendant/:defendantId/subpoena/:subpoenaId')
  // Calls the police inside a transaction of its own: no lock.
  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
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

    return this.sequelize.transaction((transaction) =>
      this.subpoenaService.getSubpoena(
        theCase,
        defendant,
        subpoena,
        transaction,
        user,
      ),
    )
  }

  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get([
    'defendant/:defendantId/subpoena',
    'defendant/:defendantId/subpoena/:subpoenaId/pdf',
  ])
  // Strictly speaking, only district court users need access to
  // split case defendants' subpoenas
  // However, giving prosecution users access does not pose a security risk
  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    SplitDefendantExistsGuard,
    SubpoenaExistsOptionalGuard,
  )
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

    const pdf = await this.sequelize.transaction((transaction) =>
      this.pdfService.getSubpoenaPdf(
        theCase,
        defendant,
        transaction,
        subpoena,
        arraignmentDate,
        location,
        subpoenaType,
      ),
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
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get('defendant/:defendantId/subpoena/:subpoenaId/serviceCertificate')
  // Strictly speaking, only district court users need access to
  // split case defendants' subpoena service certificates
  // However, giving prosecution users access does not pose a security risk
  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    SplitDefendantExistsGuard,
    SubpoenaExistsGuard,
  )
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
