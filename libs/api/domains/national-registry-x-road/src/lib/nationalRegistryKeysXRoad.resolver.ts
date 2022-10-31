import { Resolver, Query } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Scopes } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { NationalRegistryReligion } from '../models/nationalRegistryReligion.model'

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
