import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { LawyersService, LawyerType } from '@island.is/judicial-system/lawyers'

import { LawyerRegistryService } from './lawyerRegistry.service'

@Controller('api')
@ApiTags('lawyer-registry')
export class LawyerRegistryController {
  constructor(
    private readonly lawyerRegistryService: LawyerRegistryService,
    private readonly lawyersService: LawyersService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('lawyers')
  async getLawyerRegistry() {
    const lawyers = await this.lawyerRegistryService.populate()

    return lawyers
  }
}
