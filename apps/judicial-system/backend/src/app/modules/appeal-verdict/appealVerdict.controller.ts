import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases, type User } from '@island.is/judicial-system/types'

import { publicProsecutorStaffRule } from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { AppealVerdict, Case } from '../repository'
import { AppealVerdictService } from './appealVerdict.service'
import { SendAppealVerdictToServiceDto } from './dto/sendAppealVerdictToService.dto'

@Controller('api/case/:caseId/appealVerdict')
@ApiTags('appeal verdicts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppealVerdictController {
  constructor(
    private readonly appealVerdictService: AppealVerdictService,
    private readonly auditTrailService: AuditTrailService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Post('sendToService')
  @ApiCreatedResponse({
    type: AppealVerdict,
    isArray: true,
    description: 'Sends COA verdicts to electronic service for defendants',
  })
  async sendToService(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @CurrentHttpUser() user: User,
    @Body() dto: SendAppealVerdictToServiceDto,
  ): Promise<AppealVerdict[]> {
    this.logger.debug(`Sending COA verdicts to service for case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_VERDICT,
      this.appealVerdictService.sendToService(
        theCase,
        dto.defendantIds,
        user,
        transaction,
      ),
      caseId,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Post('syncServiceStatuses')
  @ApiOkResponse({
    type: AppealVerdict,
    isArray: true,
    description:
      'Syncs COA verdict service statuses from the police for waiting defendants',
  })
  async syncServiceStatuses(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @CurrentHttpUser() user: User,
  ): Promise<AppealVerdict[]> {
    this.logger.debug(`Syncing COA verdict service statuses for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.SYNC_APPEAL_VERDICT_SERVICE_STATUSES,
      this.appealVerdictService.syncServiceStatusesForCase(theCase, user, () =>
        getOrCreateTransaction(this.sequelize),
      ),
      caseId,
    )
  }
}
