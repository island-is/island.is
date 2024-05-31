import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CasesResponse } from './models/cases.response'
import { DefenderAssignmentDto } from './models/subpoena.dto'
import { SubpoenaResponse } from './models/subpoena.response'
import { CaseService } from './case.service'

@Controller('api')
@ApiTags('cases')
//@UseGuards(IdsUserGuard)
export class CaseController {
  constructor(
    private readonly caseService: CaseService,

    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('test')
  @ApiCreatedResponse({ type: String, description: 'Test connection' })
  async test(@CurrentUser() user: User): Promise<string> {
    this.logger.debug('Testing connection')

    return this.caseService.testConnection(user.nationalId)
  }

  @Get('cases')
  @ApiCreatedResponse({ type: String, description: 'Get all cases' })
  async getAllCases(
    @CurrentUser() user: User,
    @Query() query?: { lang: string },
  ): Promise<CasesResponse[]> {
    this.logger.debug('Getting all cases')

    return this.caseService.getCases(user.nationalId, query?.lang)
  }

  @HttpCode(200)
  @Patch('cases/:caseId/subpoena')
  async assignDefenderToSubpoena(
    //@CurrentUser() user: User,
    @Param('caseId') caseId: string,
    @Body() defenderAssignment: DefenderAssignmentDto,
  ): Promise<SubpoenaResponse> {
    this.logger.debug(`Assigning defender to subpoena ${caseId}`)

    return this.caseService.assignDefenderToSubpoena(
      '0108912489',
      caseId,
      defenderAssignment,
    )
  }
}
import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CaseResponse } from './models/case.response'
import { CasesResponse } from './models/cases.response'
import { CaseService } from './case.service'

@Controller('api')
@ApiTags('cases')
@UseGuards(IdsUserGuard)
export class CaseController {
  constructor(
    private readonly caseService: CaseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('test')
  @ApiCreatedResponse({ type: String, description: 'Test connection' })
  async test(@CurrentUser() user: User): Promise<string> {
    this.logger.debug('Testing connection')

    return this.caseService.testConnection(user.nationalId)
  }

  @Get('cases')
  @ApiCreatedResponse({
    type: CasesResponse,
    isArray: true,
    description: 'Get all cases',
  })
  async getAllCases(
    @CurrentUser() user: User,
    @Query() query?: { lang: string },
  ): Promise<CasesResponse[]> {
    this.logger.debug('Getting all cases')

    return this.caseService.getCases(user.nationalId, query?.lang)
  }

  @Get('case/:caseId')
  @ApiCreatedResponse({ type: CaseResponse, description: 'Get case by id' })
  async getCase(
    @Param('caseId') caseId: string,
    @CurrentUser() user: User,
    @Query() query?: { lang: string },
  ): Promise<CaseResponse> {
    this.logger.debug('Getting case by id')

    return this.caseService.getCaseById(caseId, user.nationalId, query?.lang)
  }
}
