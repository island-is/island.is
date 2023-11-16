import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'
import { AppService } from './app.service'

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(@Body() caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a case')

    return this.appService.create(caseToCreate).then((createdCase) => {
      this.logger.info(`Case ${createdCase.id} created`)

      return createdCase
    })
  }
}
