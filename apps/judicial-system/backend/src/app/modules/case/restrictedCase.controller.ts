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

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
  TokenGuard,
} from '@island.is/judicial-system/auth'
import type { User as TUser } from '@island.is/judicial-system/types'

import { defenderRule } from '../../guards'
import { User } from '../user'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { RestrictedCaseExistsGuard } from './guards/restrictedCaseExists.guard'
import { CaseCompletedGuard } from './guards/caseCompleted.guard'
import { CaseDefenderGuard } from './guards/caseDefender.guard'
import { CurrentCase } from './guards/case.decorator'
import { Case } from './models/case.model'
import { CaseService } from './case.service'
import { RestrictedCaseService } from './restrictedCase.service'

@Controller('api/case/:caseId')
@ApiTags('restricted cases')
export class RestrictedCaseController {
  constructor(
    private readonly caseService: CaseService,
    private readonly restrictedCaseService: RestrictedCaseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    new JwtAuthGuard(true),
    RolesGuard,
    RestrictedCaseExistsGuard,
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('restricted')
  @ApiOkResponse({
    type: Case,
    description: 'Gets a limited set of properties of an existing case',
  })
  getById(@Param('caseId') caseId: string, @CurrentCase() theCase: Case): Case {
    this.logger.debug(`Getting restricted case ${caseId} by id`)

    return theCase
  }

  @UseGuards(TokenGuard, CaseExistsGuard)
  @Get('defender/restricted')
  @ApiOkResponse({
    type: User,
    description: 'Gets a case defender by national id',
  })
  findDefenderNationalId(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Query('nationalId') nationalId: string,
  ): Promise<User> {
    this.logger.debug(`Getting a defender by national id from case ${caseId}`)

    return this.restrictedCaseService.findDefenderNationalId(
      theCase,
      nationalId,
    )
  }

  @UseGuards(
    new JwtAuthGuard(true),
    RolesGuard,
    RestrictedCaseExistsGuard,
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('request/restricted')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the request for an existing case as a pdf document',
  })
  async getRequestPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the request for case ${caseId} as a pdf document`,
    )

    const pdf = await this.caseService.getRequestPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    new JwtAuthGuard(true),
    RolesGuard,
    RestrictedCaseExistsGuard,
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('courtRecord/restricted')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the court record for an existing case as a pdf document',
  })
  async getCourtRecordPdf(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the court record for case ${caseId} as a pdf document`,
    )

    const pdf = await this.caseService.getCourtRecordPdf(theCase, user)

    res.end(pdf)
  }

  @UseGuards(
    new JwtAuthGuard(true),
    RolesGuard,
    RestrictedCaseExistsGuard,
    CaseCompletedGuard,
    CaseDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('ruling/restricted')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the ruling for an existing case as a pdf document',
  })
  async getRulingPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(`Getting the ruling for case ${caseId} as a pdf document`)

    const pdf = await this.caseService.getRulingPdf(theCase)

    res.end(pdf)
  }
}
