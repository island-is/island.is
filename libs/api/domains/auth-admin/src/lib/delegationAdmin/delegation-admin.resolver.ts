import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { DelegationAdminService } from './delegation-admin.service'
import {
  DelegationAdminCustomModel,
  DelegationAdminModel,
} from './models/delegation.model'

import { CurrentUser, IdsUserGuard, User } from '@island.is/auth-nest-tools'
import {
  Identity,
  IdentityDataLoader,
  IdentityLoader,
} from '@island.is/api/domains/identity'
import { Loader } from '@island.is/nest/dataloader'
import { DelegationDTO } from '@island.is/auth-api-lib'

@UseGuards(IdsUserGuard)
@Resolver(DelegationAdminModel)
export class DelegationAdminResolver {
  constructor(
    private readonly delegationAdminService: DelegationAdminService,
  ) {}

  @Query(() => DelegationAdminCustomModel, { name: 'authAdminDelegationAdmin' })
  async getDelegationSystem(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ) {
    return this.delegationAdminService.getDelegationAdmin(user, nationalId)
  }

  @ResolveField('from', () => Identity)
  resolveFromIdentity(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() customDelegation: DelegationDTO,
  ) {
    return identityLoader.load(customDelegation.fromNationalId)
  }

  @ResolveField('to', () => Identity)
  resolveToIdentity(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() customDelegation: DelegationDTO,
  ) {
    return identityLoader.load(customDelegation.toNationalId)
  }
}
