import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import {
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { NationalRegistryReligion } from '../models/nationalRegistryReligion.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver()
@Audit({ namespace: '@island.is/api/national-registry-x-road' })
export class NationalRegistryKeysXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  @Query(() => [NationalRegistryReligion], {
    name: 'nationalRegistryReligions',
    nullable: true,
  })
  @Audit()
  async nationalRegistryReligions(): Promise<
    NationalRegistryReligion[] | null
  > {
    return this.nationalRegistryXRoadService.getReligions()
  }
}
