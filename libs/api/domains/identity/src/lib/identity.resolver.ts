import { UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import {
  NationalRegistryService,
  NationalRegistryUser,
} from '@island.is/api/domains/national-registry'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { IdentityInput } from './identity.input'
import { IdentityService } from './identity.service'
import { IdentityType } from './identity.type'
import { Identity, IdentityCompany,IdentityPerson } from './models'

@UseGuards(IdsUserGuard)
@Resolver(() => Identity)
export class IdentityResolver {
  constructor(private identityService: IdentityService) {}

  @Query(() => Identity, { name: 'identity', nullable: true })
  getIdentity(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: IdentityInput,
  ): Promise<Identity | null> {
    const nationalId = input?.nationalId || user.nationalId
    return this.identityService.getIdentity(nationalId, user)
  }
}
