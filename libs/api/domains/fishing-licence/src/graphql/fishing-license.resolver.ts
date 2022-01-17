import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { FishingLicenseService } from '../lib/fishing-license.service'
import { Ship } from './models/ship.model'
import { FishingLicense } from './models/fishing-license.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class FishingLicenseResolver {
  constructor(private fishingLicenseService: FishingLicenseService) {}

  @Query(() => [Ship], {
    name: 'ships',
    nullable: true,
  })
  @Audit()
  async shipQuery(@CurrentUser() user: User): Promise<Ship[]> {
    return await this.fishingLicenseService.getShips(user.nationalId)
  }

  @Query(() => [FishingLicense], { name: 'fishingLicenses' })
  @Audit()
  async fishingLicensesQuery(
    @Args('registrationNumber', { type: () => Number })
    registrationNumber: number,
  ) {
    return await this.fishingLicenseService.getFishingLicences(
      registrationNumber,
    )
  }
}
