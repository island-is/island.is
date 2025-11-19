import {
  BadGatewayException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
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
import { LawyerRegistry } from '../repository'
import { LawyerRegistryService } from './lawyerRegistry.service'

@UseGuards(TokenGuard)
@Controller('api')
@ApiTags('lawyer-registry')
export class LawyerRegistryController {
  constructor(
    private readonly lawyerRegistryService: LawyerRegistryService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('lawyer-registry/reset')
  @ApiOkResponse({ description: 'Resets a local copy of lawyer registry' })
  async resetLawyerRegistry(): Promise<LawyerFull[]> {
    this.logger.debug('Resetting lawyer registry')

    try {
      const lawyers = await this.lawyerRegistryService.populate()

      this.logger.info('Lawyer registry reset successfully')
      await this.eventService.postDailyLawyerRegistryResetEvent(lawyers.length)

      return lawyers
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error
      }

      this.logger.error('Failed to reset lawyer registry', { error })

      throw new InternalServerErrorException(
        'Failed to reset lawyer registry',
        error,
      )
    }
  }

  @Get('lawyer-registry')
  @ApiOkResponse({ description: 'Gets all lawyers in lawyer registry' })
  async getAll(
    @Query('lawyerType') lawyerType: LawyerType,
  ): Promise<LawyerRegistry[]> {
    this.logger.debug('Getting all lawyers in lawyer registry')

    try {
      return await this.lawyerRegistryService.getAll(lawyerType)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      this.logger.error('Failed to get all lawyers from lawyer registry', {
        error,
      })

      throw new InternalServerErrorException(
        'Failed to get all lawyers from lawyer registry',
        error,
      )
    }
  }

  @Get('lawyer-registry/:nationalId')
  @ApiOkResponse({
    description: 'Gets a lawyer in lawyer registry by nationalId',
  })
  async getByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<LawyerRegistry> {
    this.logger.debug('Getting a lawyer in lawyer registry by nationalId')

    try {
      return await this.lawyerRegistryService.getByNationalId(nationalId)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      this.logger.error(`Failed to get a lawyer by national id ${nationalId}`, {
        error,
      })

      throw new InternalServerErrorException(
        'Failed to get lawyer by national id',
        error,
      )
    }
  }
}
