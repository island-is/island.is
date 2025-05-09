import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
} from '@island.is/judicial-system/auth'
import { CaseTableType, User } from '@island.is/judicial-system/types'

import { CaseTableResponse } from './dto/caseTable.response'
import { CaseTableTypeGuard } from './guards/caseTableType.guard'
import { CaseTableService } from './caseTable.service'

@Controller('api/')
@ApiTags('case-tables')
@UseGuards(JwtAuthUserGuard, CaseTableTypeGuard)
export class CaseTableController {
  constructor(
    private readonly caseTableService: CaseTableService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('case-table')
  @ApiQuery({
    name: 'type',
    enum: CaseTableType,
    required: true,
    description: 'The case table type',
  })
  @ApiOkResponse({
    type: CaseTableResponse,
    description: 'Gets a case table of a specific type',
  })
  async getCaseTable(
    @CurrentHttpUser() user: User,
    @Query('type') type: CaseTableType,
  ): Promise<CaseTableResponse> {
    this.logger.debug(
      `Getting a case table of type ${type} for user ${user.id}`,
    )

    return this.caseTableService.getCaseTableRows(type, user)
  }
}
