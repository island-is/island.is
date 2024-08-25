import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Controller, Get, UseGuards, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL, '1'],
})
export class UserController {
  constructor() {}

  @Scopes('@admin.island.is/delegation-system')
  @Get()
  @Audit()
  @ApiOkResponse({ type: Boolean })
  async getUser(): Promise<boolean> {
    return true
  }
}
