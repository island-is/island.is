import { CacheInterceptor } from '@nestjs/cache-manager'
import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { Lawyer, LawyersService } from '@island.is/judicial-system/lawyers'

@Controller('api')
@ApiTags('defenders')
@UseInterceptors(CacheInterceptor)
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
