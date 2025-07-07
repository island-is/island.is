import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import { LawyerFull, LawyerType } from '@island.is/judicial-system/types'

import { EventService } from '../event'
import { LawyerRegistry } from './lawyerRegistry.model'
import { LawyerRegistryService } from './lawyerRegistry.service'

@Controller()
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
  async resetLawyerRegistry(): Promise<LawyerFull[]> {
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

  @UseGuards(TokenGuard)
  @Get('lawyer-registry')
  @ApiOkResponse({ description: 'Gets all lawyers in lawyer registry' })
  async getAll(
    @Query('lawyerType') lawyerType: LawyerType,
  ): Promise<LawyerRegistry[]> {
    this.logger.debug('Getting all lawyers in lawyer registry')

    try {
      const lawyers = await this.lawyerRegistryService.getAll(lawyerType)

      return lawyers
    } catch (error) {
      this.logger.error('Failed to get all lawyers from lawyer registry', error)
      throw error
    }
  }

  @UseGuards(TokenGuard)
  @Get('lawyer-registry/:nationalId')
  @ApiOkResponse({
    description: 'Gets a lawyer in lawyer registry by nationalId',
  })
  async getByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<LawyerRegistry> {
    this.logger.debug('Getting a lawyer in lawyer registry by nationalId')

    try {
      const lawyer = await this.lawyerRegistryService.getByNationalId(
        nationalId,
      )

      return lawyer
    } catch (error) {
      this.logger.error(
        `Failed to get lawyer with nationalId: ${nationalId}`,
        error,
      )
      throw error
    }
  }
}
