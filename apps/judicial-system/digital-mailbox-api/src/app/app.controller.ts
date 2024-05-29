import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CaseResponse } from './models/case.response'
import { CasesResponse } from './models/cases.response'
import { AppService } from './app.service'

@Controller('api')
@UseGuards(IdsUserGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('test')
  @ApiCreatedResponse({ type: String, description: 'Test connection' })
  async test(@CurrentUser() user: User): Promise<string> {
    this.logger.debug('Testing connection')

    return this.appService.testConnection(user.nationalId)
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

    return this.appService.getCases(user.nationalId, query?.lang)
  }

  @Get('case/:caseId')
  @ApiCreatedResponse({ type: CaseResponse, description: 'Get case by id' })
  async getCase(
    @Param('caseId') caseId: string,
    @CurrentUser() user: User,
    @Query() query?: { lang: string },
  ): Promise<CaseResponse> {
    this.logger.debug('Getting case by id')

    return this.appService.getCaseById(caseId, user.nationalId, query?.lang)
  }
}
