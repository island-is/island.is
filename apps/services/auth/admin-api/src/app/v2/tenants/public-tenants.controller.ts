import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { TenantsService } from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'

import { PublicTenantDto } from './dto/public-tenant.dto'

@ApiTags('public')
@Controller({
  path: 'public/tenants',
  version: ['2'],
})
export class PublicTenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @Documentation({
    description: 'Get all publicly visible tenants.',
    response: { status: 200, type: [PublicTenantDto] },
  })
  findAll(): Promise<PublicTenantDto[]> {
    return this.tenantsService.findAllPublic()
  }
}
