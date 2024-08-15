import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { DisabilityLicenseService } from '@island.is/clients/disability-license'
import { ApiScope } from '@island.is/auth/scopes'
import {
  DonationException,
  DonationExceptionInput,
  DonorStatus,
  DonorStatusInput,
} from './models/organ-donation.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class HealthDirectorateResolver {
  constructor(private disabilityLicenseApi: DisabilityLicenseService) {}

  @Query(() => DonorStatus)
  getDonorStatus(@CurrentUser() user: User): Promise<DonorStatus> {
    return Promise.resolve({} as DonorStatus)
  }

  @Query(() => DonationException)
  getDonationExceptions(
    @Args('input') input: DonationExceptionInput,
    @CurrentUser() user: User,
  ): Promise<DonationException> {
    return Promise.resolve({} as DonationException)
  }

  @Mutation(() => DonorStatus)
  async endorsementSystemCreateEndorsementList(
    @Args('input') input: DonorStatusInput,
    @CurrentUser() user: User,
  ): Promise<DonorStatus> {
    return {} as DonorStatus
  }
}
