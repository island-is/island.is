import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common'
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
import { CaseTableMembershipResponse } from './dto/caseTableMembership.response'
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
  @Get('case-table-membership')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CaseTableMembershipResponse,
    description:
      'Returns which case tables (for the current user role) the case belongs to. Use for breadcrumbs on the case page.',
  })
  @ApiQuery({
    name: 'caseId',
    type: String,
    required: true,
    description: 'The case id',
  })
  async getCaseTableMembership(
    @CurrentHttpUser() user: User,
    @Query('caseId') caseId: string,
  ): Promise<CaseTableMembershipResponse> {
    const caseTableTypes = await this.caseTableService.getCaseTableMembership(
      caseId,
      user,
    )
    if (caseTableTypes === null) {
      throw new NotFoundException('Case not found or access denied')
    }
    return { caseTableTypes }
  }
}
