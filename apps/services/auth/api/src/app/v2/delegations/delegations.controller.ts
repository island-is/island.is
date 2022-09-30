import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  DelegationScopeService,
  DelegationsService,
} from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller({
  path: 'delegations',
  version: ['2'],
})
export class DelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly delegationScopeService: DelegationScopeService,
  ) {}

  @Documentation({})
  async findAll(): Promise<void> {
    return
  }

  async find(): Promise<void> {
    return
  }
}
