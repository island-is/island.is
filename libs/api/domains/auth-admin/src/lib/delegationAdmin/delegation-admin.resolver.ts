import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { DelegationAdminService } from './delegation-admin.service'
import { DelegationAdminCustomModel } from './models/delegation.model'

import { CurrentUser, IdsUserGuard, User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver()
export class DelegationAdminResolver {
  constructor(
    private readonly delegationAdminService: DelegationAdminService,
  ) {}

  @Query(() => DelegationAdminCustomModel, { name: 'authAdminDelegationAdmin' })
  async getDelegationSystem(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ) {
    return await this.delegationAdminService.getDelegationAdmin(
      user,
      nationalId,
    )
  }
}
