import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { IdentityClientService } from '@island.is/clients/identity'
import { Identity } from '@island.is/api/domains/identity'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { AuthDelegationType } from '@island.is/clients/auth/delegation-api'
import type { MergedDelegationDTO } from '@island.is/clients/auth/public-api'

import { MergedDelegation } from '../models/delegation.model'

@UseGuards(IdsUserGuard)
@Resolver(() => MergedDelegation)
export class MergedDelegationResolver {
  constructor(private identityService: IdentityClientService) {}

  @ResolveField('to', () => Identity)
  async resolveTo(
    @Parent() delegation: MergedDelegationDTO,
  ): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(
      delegation.toNationalId,
      {
        name: delegation.toName ?? undefined,
      },
    )
  }

  @ResolveField('from', () => Identity)
  async resolveFrom(
    @Parent() delegation: MergedDelegationDTO,
  ): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(
      delegation.fromNationalId,
      {
        name: delegation.fromName ?? undefined,
      },
    )
  }

  @ResolveField('type', () => AuthDelegationType, {
    deprecationReason: 'Use types instead',
  })
  resolveDelegationType(
    @Parent() delegation: MergedDelegationDTO,
  ): AuthDelegationType {
    return delegation.types[0]
  }
}
