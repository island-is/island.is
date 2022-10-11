import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { IdentityInput } from './identity.input'
import { Identity } from './models'
import { IdentityClientService } from '@island.is/clients/identity'

@UseGuards(IdsUserGuard)
@Resolver(() => Identity)
export class IdentityResolver {
  constructor(private identityService: IdentityClientService) {}

  @Query(() => Identity, { name: 'identity', nullable: true })
  getIdentity(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: IdentityInput,
  ): Promise<Identity | null> {
    const nationalId = input?.nationalId || user.nationalId
    return this.identityService.getIdentity(nationalId)
  }
}
