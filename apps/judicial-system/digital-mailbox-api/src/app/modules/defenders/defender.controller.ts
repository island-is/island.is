import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  BadGatewayException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { LawyersService, LawyerType } from '@island.is/judicial-system/lawyers'

import { Defender } from './models/defender.response'

@Controller('api')
@ApiTags('defenders')
@UseInterceptors(CacheInterceptor)
export class DefenderController {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly lawyersService: LawyersService,
  ) {}

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

  @Get('defender/:nationalId')
  @ApiOkResponse({
    type: Defender,
    description: 'Retrieves a defender by national id',
  })
  @ApiResponse({ status: 404, description: 'Defender not found' })
  @ApiResponse({ status: 502, description: 'Failed to retrieve defender' })
  async getLawyer(@Param('nationalId') nationalId: string): Promise<Defender> {
    try {
      this.logger.debug(`Retrieving lawyer by national id ${nationalId}`)

      const lawyer = await this.lawyersService.getLawyer(nationalId)
      return {
        nationalId: lawyer.SSN,
        name: lawyer.Name,
        practice: lawyer.Practice,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      this.logger.error('Failed to retrieve lawyer', error)
      throw new BadGatewayException('Failed to retrieve lawyer')
    }
  }
}
