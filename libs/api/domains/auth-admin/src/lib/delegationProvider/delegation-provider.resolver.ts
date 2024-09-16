import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import {
  DelegationProvider,
  DelegationProviderPayload,
} from './dto/delegation-provider.dto'
import { DelegationProviderService } from './delegation-provider.service'

@UseGuards(IdsUserGuard)
@Resolver(() => DelegationProvider)
export class DelegationProviderResolver {
  constructor(private delegationProvider: DelegationProviderService) {}

  @Query(() => DelegationProviderPayload, {
    name: 'authDelegationProviders',
  })
  getDomains(@CurrentUser() user: User): Promise<DelegationProviderPayload> {
    return this.delegationProvider.getDelegationProviders(user)
  }
}
