import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { JwtAuthGuard } from '@island.is/judicial-system/auth'

import { Institution } from './institution.model'
import { InstitutionService } from './institution.service'

@Controller('api')
@ApiTags('institutions')
@UseGuards(JwtAuthGuard)
export class InstitutionController {
  constructor(
    private readonly institutionService: InstitutionService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('institutions')
  @ApiOkResponse({
    type: Institution,
    isArray: true,
    description: 'Gets all existing institutions',
  })
  getAll(): Promise<Institution[]> {
    this.logger.debug('Getting all institutions')

    return this.institutionService.getAll()
  }
}
