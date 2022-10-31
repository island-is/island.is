import { Resolver, Query } from '@nestjs/graphql'
import { IdsAuthGuard, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { NationalRegistryReligion } from '../models/nationalRegistryReligion.model'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsAuthGuard, IdsUserGuard)
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
