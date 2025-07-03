import { Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import { LawyerRegistryResponse } from '@island.is/judicial-system/lawyers'

import { EventService } from '../event'
import { LawyerRegistryService } from './lawyerRegistry.service'

@Controller('api')
@ApiTags('lawyer-registry')
export class LawyerRegistryController {
  constructor(
    private readonly lawyerRegistryService: LawyerRegistryService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(TokenGuard)
  @Post('lawyer-registry/reset')
  @ApiOkResponse({ description: 'Resets a local copy of lawyer registry' })
  async resetLawyerRegistry(): Promise<LawyerRegistryResponse[]> {
    this.logger.debug('Resetting lawyer registry')
    try {
      const lawyers = await this.lawyerRegistryService.populate()

      if (lawyers && lawyers.length > 0) {
        this.logger.info('Lawyer registry reset successfully')
        await this.eventService.postDailyLawyerRegistryResetEvent(
          lawyers.length,
        )
      }

      return lawyers
    } catch (error) {
      this.logger.error('Failed to reset lawyer registry', error)
      throw error
    }
  }
}
