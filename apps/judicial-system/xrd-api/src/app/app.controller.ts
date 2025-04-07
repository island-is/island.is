import {
  BadGatewayException,
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { Get } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { LawyersService, LawyerType } from '@island.is/judicial-system/lawyers'

import { CreateCaseDto } from './dto/createCase.dto'
import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { Case } from './models/case.model'
import { Defender } from './models/defender.model'
import { SubpoenaResponse } from './models/subpoena.response'
import { EventInterceptor } from './app.interceptor'
import { AppService } from './app.service'

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly lawyersService: LawyersService,
  ) {}

  @UseInterceptors(EventInterceptor)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(@Body() caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a case')

    return this.appService.create(caseToCreate).then((createdCase) => {
      this.logger.info(`Case ${createdCase.id} created`)

      return createdCase
    })
  }

  @Get('defenders')
  @ApiOkResponse({
    type: [Defender],
    description: 'Returns a list of defenders',
  })
  @ApiResponse({ status: 502, description: 'Failed to retrieve defenders' })
  async getLawyers(): Promise<Defender[]> {
    try {
      this.logger.debug('Retrieving litigators from lawyer registry')

      const lawyers = await this.lawyersService.getLawyers(
        LawyerType.LITIGATORS,
      )

      return lawyers.map((lawyer) => ({
        nationalId: lawyer.SSN,
        name: lawyer.Name,
        practice: lawyer.Practice,
      }))
    } catch (error) {
      this.logger.error('Failed to retrieve lawyers', error)
      throw new BadGatewayException('Failed to retrieve lawyers')
    }
  }

  @Patch('subpoena/:subpoenaId')
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 502, description: 'Failed to update subpoena' })
  async updateSubpoena(
    @Param('subpoenaId', new ParseUUIDPipe()) subpoenaId: string,
    @Body() updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    this.logger.info(`Updating subpoena ${subpoenaId}`)

    return this.appService.updateSubpoena(subpoenaId, updateSubpoena)
  }
}
