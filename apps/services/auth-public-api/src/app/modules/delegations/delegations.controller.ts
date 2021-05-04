import { DelegationsService, IDelegation } from '@island.is/auth-api-lib'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller('delegations')
export class DelegationsController {
  constructor(private readonly delegationsService: DelegationsService) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllTo(@CurrentUser() user: User): Promise<IDelegation[]> {
    return await this.delegationsService.findAllTo(user.nationalId)
  }
}
