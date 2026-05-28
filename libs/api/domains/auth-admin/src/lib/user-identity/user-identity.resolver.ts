import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Environment } from '@island.is/shared/types'

import { DeleteEnvironmentResult } from '../shared/models/delete-environment-result.model'
import { DeactivateUserIdentityInput } from './dto/deactivate-user-identity.input'
import { ReactivateUserIdentityInput } from './dto/reactivate-user-identity.input'
import { UserIdentitiesInput } from './dto/user-identities.input'
import { UserIdentity } from './models/user-identity.model'
import { UserIdentityService } from './user-identity.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@Resolver(() => UserIdentity)
export class UserIdentityResolver {
  constructor(private readonly userIdentityService: UserIdentityService) {}

  @Query(() => [UserIdentity], { name: 'authAdminUserIdentities' })
  findUserIdentities(
    @CurrentUser() user: User,
    @Args('input', { type: () => UserIdentitiesInput })
    input: UserIdentitiesInput,
  ): Promise<UserIdentity[]> {
    return this.userIdentityService.findUserIdentities(user, input)
  }

  @Query(() => [Environment], {
    name: 'authAdminUserIdentityConfiguredEnvironments',
  })
  getConfiguredEnvironments(): Environment[] {
    return this.userIdentityService.getAvailableEnvironments()
  }

  @Mutation(() => DeleteEnvironmentResult, {
    name: 'deactivateAuthAdminUserIdentity',
  })
  deactivateUserIdentity(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeactivateUserIdentityInput })
    input: DeactivateUserIdentityInput,
  ): Promise<DeleteEnvironmentResult> {
    return this.userIdentityService.setActive(
      user,
      input.subjectId,
      false,
      input.environments,
    )
  }

  @Mutation(() => DeleteEnvironmentResult, {
    name: 'reactivateAuthAdminUserIdentity',
  })
  reactivateUserIdentity(
    @CurrentUser() user: User,
    @Args('input', { type: () => ReactivateUserIdentityInput })
    input: ReactivateUserIdentityInput,
  ): Promise<DeleteEnvironmentResult> {
    return this.userIdentityService.setActive(
      user,
      input.subjectId,
      true,
      input.environments,
    )
  }
}
