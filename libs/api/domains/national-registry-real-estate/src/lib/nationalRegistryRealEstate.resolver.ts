import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Parent, Context } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryRealEstateService } from './nationalRegistryRealEstate.service'
import { NationalRegistryRealEstate } from '../models/nationalRegistryRealEstate.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver()
@Audit({ namespace: '@island.is/api/national-registry-real-estate' })
export class NationalRegistryRealEstateResolver {
  constructor(
    private nationalRegistryRealEstateService: NationalRegistryRealEstateService,
  ) {}

  @Query(() => [NationalRegistryRealEstate], {
    name: 'nationalRegistryMyRealEstates',
    nullable: true,
  })
  @Audit()
  async getNationalRegistryMyRealEstates(
    @CurrentUser() user: User,
  ): Promise<NationalRegistryRealEstate[] | undefined> {
    return await this.nationalRegistryRealEstateService.getMyRealEstates(user)
  }
}
