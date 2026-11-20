import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

import { DirectorateOfEqualityService } from './directorate-of-equality.service'
import { IssueApiKeyInput, RevokeApiKeyInput } from './dto/apiKey.input'
import {
  GrantServiceProviderInput,
  RevokeServiceProviderInput,
} from './dto/serviceProvider.input'
import { ApiKeys, IssuedApiKey } from './models/apiKey.model'
import { Company } from './models/company.model'
import { MutationResult } from './models/mutationResult.model'
import {
  AvailableServiceProviders,
  ServiceProviders,
} from './models/serviceProvider.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.directorateOfEqualityCompany)
@FeatureFlag(Features.isServicePortalEqualityPageEnabled)
@Audit({ namespace: '@island.is/api/directorate-of-equality' })
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver()
export class AccessResolver {
  constructor(
    private readonly directorateOfEqualityService: DirectorateOfEqualityService,
  ) {}

  @Query(() => Company, {
    name: 'directorateOfEqualityCompany',
    nullable: true,
  })
  @Audit()
  company(@CurrentUser() user: User): Promise<Company | null> {
    return this.directorateOfEqualityService.getCompany(user)
  }

  @Query(() => ApiKeys, {
    name: 'directorateOfEqualityApiKeys',
    nullable: true,
  })
  @Audit()
  apiKeys(@CurrentUser() user: User): Promise<ApiKeys | null> {
    return this.directorateOfEqualityService.getApiKeys(user)
  }

  @Query(() => ServiceProviders, {
    name: 'directorateOfEqualityServiceProviders',
    nullable: true,
  })
  @Audit()
  serviceProviders(
    @CurrentUser() user: User,
  ): Promise<ServiceProviders | null> {
    return this.directorateOfEqualityService.getServiceProviders(user)
  }

  @Query(() => AvailableServiceProviders, {
    name: 'directorateOfEqualityAvailableServiceProviders',
    nullable: true,
  })
  @Audit()
  availableServiceProviders(
    @CurrentUser() user: User,
  ): Promise<AvailableServiceProviders | null> {
    return this.directorateOfEqualityService.getAvailableServiceProviders(user)
  }

  @Mutation(() => IssuedApiKey, { name: 'issueDirectorateOfEqualityApiKey' })
  @Audit()
  issueApiKey(
    @Args('input') input: IssueApiKeyInput,
    @CurrentUser() user: User,
  ): Promise<IssuedApiKey> {
    return this.directorateOfEqualityService.issueApiKey(user, input)
  }

  @Mutation(() => MutationResult, {
    name: 'revokeDirectorateOfEqualityApiKey',
  })
  @Audit()
  revokeApiKey(
    @Args('input') input: RevokeApiKeyInput,
    @CurrentUser() user: User,
  ): Promise<MutationResult> {
    return this.directorateOfEqualityService.revokeApiKey(user, input)
  }

  @Mutation(() => MutationResult, {
    name: 'grantDirectorateOfEqualityServiceProvider',
  })
  @Audit()
  grantServiceProvider(
    @Args('input') input: GrantServiceProviderInput,
    @CurrentUser() user: User,
  ): Promise<MutationResult> {
    return this.directorateOfEqualityService.grantServiceProvider(user, input)
  }

  @Mutation(() => MutationResult, {
    name: 'revokeDirectorateOfEqualityServiceProvider',
  })
  @Audit()
  revokeServiceProvider(
    @Args('input') input: RevokeServiceProviderInput,
    @CurrentUser() user: User,
  ): Promise<MutationResult> {
    return this.directorateOfEqualityService.revokeServiceProvider(user, input)
  }
}
