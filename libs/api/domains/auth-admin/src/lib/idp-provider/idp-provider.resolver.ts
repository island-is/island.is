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
import { IdpProvider } from './models/idp-provider.model'
import { IdpProvidersPayload } from './dto/idp-providers.payload'
import { IdpProvidersInput } from './dto/idp-providers.input'
import { CreateIdpProviderInput } from './dto/create-idp-provider.input'
import { UpdateIdpProviderInput } from './dto/update-idp-provider.input'
import { DeleteIdpProviderInput } from './dto/delete-idp-provider.input'
import { IdpProviderService } from './idp-provider.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@Resolver(() => IdpProvider)
export class IdpProviderResolver {
  constructor(private readonly idpProviderService: IdpProviderService) {}

  @Query(() => IdpProvidersPayload, { name: 'authAdminIdpProviders' })
  getIdpProviders(
    @CurrentUser() user: User,
    @Args('input') input: IdpProvidersInput,
  ): Promise<IdpProvidersPayload> {
    return this.idpProviderService.getIdpProviders(user, input)
  }

  @Query(() => IdpProvider, {
    name: 'authAdminIdpProvider',
    nullable: true,
  })
  getIdpProvider(
    @CurrentUser() user: User,
    @Args('name', { type: () => String }) name: string,
  ): Promise<IdpProvider | null> {
    return this.idpProviderService.getIdpProvider(user, name)
  }

  @Query(() => [Environment], {
    name: 'authAdminIdpProviderConfiguredEnvironments',
  })
  getConfiguredEnvironments(): Environment[] {
    return this.idpProviderService.getAvailableEnvironments()
  }

  @Mutation(() => IdpProvider, { name: 'createAuthAdminIdpProvider' })
  createIdpProvider(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateIdpProviderInput })
    input: CreateIdpProviderInput,
  ): Promise<IdpProvider> {
    return this.idpProviderService.createIdpProvider(user, input)
  }

  @Mutation(() => IdpProvider, { name: 'updateAuthAdminIdpProvider' })
  updateIdpProvider(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateIdpProviderInput })
    input: UpdateIdpProviderInput,
  ): Promise<IdpProvider> {
    return this.idpProviderService.updateIdpProvider(user, input)
  }

  @Mutation(() => DeleteEnvironmentResult, {
    name: 'deleteAuthAdminIdpProvider',
  })
  deleteIdpProvider(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteIdpProviderInput })
    input: DeleteIdpProviderInput,
  ): Promise<DeleteEnvironmentResult> {
    return this.idpProviderService.deleteIdpProvider(
      user,
      input.name,
      input.environments,
    )
  }
}
