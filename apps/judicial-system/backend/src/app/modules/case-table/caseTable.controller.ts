import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { CaseTableType, type User } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prisonSystemStaffRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import { CaseTableResponse } from './dto/caseTable.response'
import { SearchCasesResponse } from './dto/searchCases.response'
import { CaseTableTypeGuard } from './guards/caseTableType.guard'
import { CaseTableService } from './caseTable.service'

@Controller('api/')
@ApiTags('case-tables')
@UseGuards(JwtAuthUserGuard)
export class CaseTableController {
  constructor(
    private readonly caseTableService: CaseTableService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseTableTypeGuard)
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
  getCaseTable(
    @CurrentHttpUser() user: User,
    @Query('type') type: CaseTableType,
  ): Promise<CaseTableResponse> {
    this.logger.debug(
      `Getting a case table of type ${type} for user ${user.id}`,
    )

    return this.caseTableService.getCaseTableRows(type, user)
  }

  @UseGuards(RolesGuard)
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
    prisonSystemStaffRule,
  )
  @Get('search-cases')
  @ApiOkResponse({
    type: SearchCasesResponse,
    description: 'Searches for cases',
  })
  @ApiQuery({
    name: 'query',
    type: String,
    required: true,
    description: 'The search query',
  })
  searchCases(
    @CurrentHttpUser() user: User,
    @Query('query') query: string,
  ): Promise<SearchCasesResponse> {
    this.logger.debug(`Searching for cases for user ${user.id}`)

    return this.caseTableService.searchCases(query, user)
  }
}
