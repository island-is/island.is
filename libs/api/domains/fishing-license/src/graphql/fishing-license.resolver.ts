import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { FishingLicenseShip } from './models/fishing-license-ship.model'
import { FishingLicenseLicense } from './models/fishing-license-license.model'
import { FishingLicenseService } from '../lib/fishing-license.service'

@UseGuards(IdsUserGuard, IdsAuthGuard, ScopesGuard)
@Resolver()
export class FishingLicenseResolver {
  constructor(private fishingLicenseService: FishingLicenseService) {}

  @Query(() => [FishingLicenseShip], {
    name: 'fishingLicenseShips',
    nullable: true,
  })
  @Audit()
  async shipQuery(@CurrentUser() user: User): Promise<FishingLicenseShip[]> {
    return await this.fishingLicenseService.getShips(user.nationalId, user)
  }

  @Query(() => [FishingLicenseLicense], { name: 'fishingLicenses' })
  @Audit()
  async fishingLicensesQuery(
    @Args('registrationNumber', { type: () => Number })
    registrationNumber: number,
    @CurrentUser() user: User,
  ) {
    return await this.fishingLicenseService.getFishingLicenses(
      registrationNumber,
      user,
    )
  }
}
