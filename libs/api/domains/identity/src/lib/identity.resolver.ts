import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { IdentityInput } from './identity.input'
import { Identity } from './models'
import { IdentityClientService } from '@island.is/clients/identity'
import { IdentitiesInput } from './identities.input'

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

  @Query(() => [Identity], { name: 'identities', nullable: 'items' })
  async getIdentities(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: IdentitiesInput,
  ): Promise<Array<Identity | null>> {
    const nationalIds = input?.nationalIds

    // Promise all get
    return Promise.all(
      nationalIds.map((nationalId) =>
        this.identityService.getIdentity(nationalId),
      ),
    )
  }
}
