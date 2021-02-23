import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

import { InstitutionService } from './institution.service'
import { Institution } from './institution.model'

// Allows admins to perform any action
const adminRule = UserRole.ADMIN as RolesRule

@Controller('api')
@ApiTags('institutions')
export class InstitutionController {
  constructor(
    @Inject(InstitutionService)
    private readonly institutionService: InstitutionService,
  ) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @RolesRules(adminRule)
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
