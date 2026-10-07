import { Response } from 'express'
import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Patch,
  Post,
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
import { indictmentCases, type User } from '@island.is/judicial-system/types'

import { publicProsecutorStaffRule } from '../../guards'
import {
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { AppealSummons, Case } from '../repository'
import { CreateAppealSummonsDto } from './dto/createAppealSummons.dto'
import { CurrentAppealSummons } from './guards/appealSummons.decorator'
import { AppealSummonsExistsGuard } from './guards/appealSummonsExists.guard'
import { AppealSummonsService } from './appealSummons.service'

@Controller('api/case/:caseId/appealSummons')
@ApiTags('appeal summonses')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseReadGuard,
)
export class AppealSummonsController {
  constructor(
    private readonly appealSummonsService: AppealSummonsService,
    private readonly pdfService: PdfService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(publicProsecutorStaffRule)
  @Post()
  @ApiCreatedResponse({
    type: AppealSummons,
    description: 'Creates an appeal summons',
  })
  create(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() dto: CreateAppealSummonsDto,
    @CurrentHttpUser() user: User,
  ): Promise<AppealSummons> {
    this.logger.debug(`Creating an appeal summons for case ${caseId}`)

    return this.sequelize.transaction((transaction) =>
      this.appealSummonsService.create(theCase, dto, user, transaction),
    )
  }

  @RolesRules(publicProsecutorStaffRule)
  @UseGuards(AppealSummonsExistsGuard)
  @Patch(':appealSummonsId')
  @ApiOkResponse({
    type: AppealSummons,
    description: 'Updates an appeal summons',
  })
  update(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @Body() dto: CreateAppealSummonsDto,
    @CurrentHttpUser() user: User,
  ): Promise<AppealSummons> {
    this.logger.debug(
      `Updating appeal summons ${appealSummonsId} of case ${caseId}`,
    )

    return this.sequelize.transaction((transaction) =>
      this.appealSummonsService.update(
        theCase,
        summons,
        dto,
        user,
        transaction,
      ),
    )
  }

  @RolesRules(publicProsecutorStaffRule)
  @UseGuards(AppealSummonsExistsGuard)
  @Get(':appealSummonsId/pdf')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets an appeal summons as a pdf document',
  })
  async getPdf(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting appeal summons ${appealSummonsId} of case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getAppealSummonsPdf(theCase, user, summons)

    res.end(pdf)
  }

  @RolesRules(publicProsecutorStaffRule)
  @Post('preview')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Previews an unsaved appeal summons as a pdf document',
  })
  async preview(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() dto: CreateAppealSummonsDto,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(`Previewing an appeal summons pdf for case ${caseId}`)

    const defendants = this.appealSummonsService.resolveDefendants(theCase, dto)
    const pdf = await this.pdfService.getAppealSummonsPdf(
      theCase,
      user,
      undefined,
      defendants,
    )

    res.end(pdf)
  }
}
