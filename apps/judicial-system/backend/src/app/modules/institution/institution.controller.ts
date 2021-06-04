import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@island.is/judicial-system/auth'

import { InstitutionService } from './institution.service'
import { Institution } from './institution.model'

@Controller('api')
@ApiTags('institutions')
@UseGuards(JwtAuthGuard)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get('institutions')
  @ApiOkResponse({
    type: Institution,
    isArray: true,
    description: 'Gets all existing institutions',
  })
  getAll(): Promise<Institution[]> {
    return this.institutionService.getAll()
  }
}
