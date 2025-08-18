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
import { ConfigType } from '@nestjs/config'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { LawyerRegistry, LawyerType } from '@island.is/judicial-system/types'

import { appModuleConfig } from '../../app.config'
import { Defender } from './models/defender.response'

@Controller('api')
@ApiTags('defenders')
@UseInterceptors(CacheInterceptor)
export class DefenderController {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('defenders')
  @ApiOkResponse({
    type: [Defender],
    description: 'Returns a list of defenders',
  })
  @ApiResponse({ status: 502, description: 'Failed to retrieve defenders' })
  async getLawyers(): Promise<Defender[]> {
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/lawyer-registry?lawyerType=${LawyerType.LITIGATORS}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
        },
      )
      if (res.ok) {
        const lawyers = await res.json()

        return lawyers.map((lawyer: LawyerRegistry) => ({
          nationalId: lawyer.nationalId,
          name: lawyer.name,
          practice: lawyer.practice,
        }))
      }

      throw new BadGatewayException('Failed to retrieve litigator lawyers')
    } catch (error) {
      this.logger.error('Failed to retrieve litigator lawyers', error)

      throw new BadGatewayException('Failed to retrieve litigator lawyers')
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
      const res = await fetch(
        `${this.config.backendUrl}/api/lawyer-registry/${nationalId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.config.secretToken}`,
          },
        },
      )

      if (res.ok) {
        const lawyer = await res.json()

        return {
          nationalId: lawyer.nationalId,
          name: lawyer.name,
          practice: lawyer.practice,
        }
      }

      throw new NotFoundException('Lawyer not found in lawyer registry')
    } catch (error) {
      this.logger.error('Failed to retrieve lawyer from lawyer registry', error)

      throw new BadGatewayException(
        'Failed to retrieve lawyer from lawyer registry',
      )
    }
  }
}
