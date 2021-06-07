import { DelegationsService, DelegationDTO } from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { environment } from '../../../environments'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller('delegations')
export class DelegationsController {
  constructor(private readonly delegationsService: DelegationsService) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllTo(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    const wards = await this.delegationsService.findAllWardsTo(
      user,
      environment.nationalRegistry.xroad.clientId ?? '',
    )

    const companies = await this.delegationsService.findAllCompaniesTo(
      user.nationalId,
    )

    const custom = await this.delegationsService.findAllValidCustomTo(
      user.nationalId,
    )

    return [...wards, ...companies, ...custom]
  }
}
