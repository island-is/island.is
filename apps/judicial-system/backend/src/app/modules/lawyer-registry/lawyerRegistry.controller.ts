import { Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { LawyerRegistryService } from './lawyerRegistry.service'

@Controller('api')
@ApiTags('lawyer-registry')
export class LawyerRegistryController {
  constructor(
    private readonly lawyerRegistryService: LawyerRegistryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(TokenGuard)
  @Post('lawyer-registry/reset')
  @ApiOkResponse({ description: 'Resets a local copy of lawyer registry' })
  async resetLawyerRegistry(): Promise<boolean> {
    this.logger.debug('Resetting lawyer registry')
    const success = await this.lawyerRegistryService.populate()

    return success
  }
}
