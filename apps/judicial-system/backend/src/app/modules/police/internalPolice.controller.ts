import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { Case, CaseExistsGuard, CurrentCase } from '../case'
import { Subpoena } from '../subpoena'
import { PoliceService } from './police.service'

@Controller('api/internal/case/:caseId')
@ApiTags('internal police')
@UseGuards(TokenGuard, CaseExistsGuard)
export class InternalPoliceController {
  constructor(
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('subpoenaStatus/:subpoenaId')
  @ApiOkResponse({
    type: Subpoena,
    description: 'Gets subpoena status',
  })
  getSubpoenaStatus(
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
  ): Promise<Subpoena> {
    this.logger.debug(`Gets subpoena status in case ${theCase.id}`)

    return this.policeService.getSubpoenaStatus(subpoenaId)
  }
}
