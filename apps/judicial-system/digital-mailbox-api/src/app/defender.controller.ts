import { Controller, Get, Inject } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { Lawyer, LawyersService } from '@island.is/judicial-system/lawyers'

import { AppService } from './app.service'

@Controller('api')
export class DefenderController {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly lawyersService: LawyersService,
  ) {}

  @Get('defenders')
  @ApiCreatedResponse({
    type: String,
    description: 'Retrieve a list of defenders',
  })
  async getLawyers(): Promise<Lawyer[]> {
    this.logger.debug('Retrieving lawyers from lawyer registry')

    return this.lawyersService.getLawyers()
  }
}
