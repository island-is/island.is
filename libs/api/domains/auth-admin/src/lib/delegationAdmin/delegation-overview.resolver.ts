import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  type User,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import {
  Identity,
  type IdentityDataLoader,
  IdentityLoader,
} from '@island.is/api/domains/identity'
import { Loader } from '@island.is/nest/dataloader'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import type { DelegationOverviewDelegationDto } from '@island.is/clients/auth/admin-api'

import { DelegationOverviewService } from './delegation-overview.service'
import {
  DelegationOverviewDelegationModel,
  DelegationOverviewModel,
} from './models/delegation-overview.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(DelegationAdminScopes.institution)
@Resolver(() => DelegationOverviewModel)
export class DelegationOverviewResolver {
  constructor(
    private readonly delegationOverviewService: DelegationOverviewService,
  ) {}

  @Query(() => DelegationOverviewModel, {
    name: 'authAdminDelegationOverview',
  })
  async getDelegationOverview(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
  ) {
    const overview = await this.delegationOverviewService.getDelegationOverview(
      user,
      nationalId,
    )
    // Only reveal the name of people with delegations on the organisation's clients.
    const hasDelegations =
      overview.incoming.length > 0 || overview.outgoing.length > 0
    const identity = hasDelegations
      ? await identityLoader.load(nationalId)
      : null

    const withScopeNames = (delegations: DelegationOverviewDelegationDto[]) =>
      delegations.map((delegation) => ({
        ...delegation,
        scopes: delegation.scopes.map(({ scopeName, ...scope }) => ({
          ...scope,
          name: scopeName,
        })),
      }))

    return {
      nationalId,
      name: identity?.name ?? null,
      clients: overview.clients,
      incoming: withScopeNames(overview.incoming),
      outgoing: withScopeNames(overview.outgoing),
    }
  }
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(DelegationAdminScopes.institution)
@Resolver(() => DelegationOverviewDelegationModel)
export class DelegationOverviewDelegationResolver {
  @ResolveField('from', () => Identity)
  resolveFrom(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() delegation: DelegationOverviewDelegationDto,
  ) {
    return identityLoader.load(delegation.fromNationalId)
  }

  @ResolveField('to', () => Identity)
  resolveTo(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() delegation: DelegationOverviewDelegationDto,
  ) {
    return identityLoader.load(delegation.toNationalId)
  }
}
