import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { ApiScope, FishingLicenseScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Ship } from './models/ship.model'
import { FishingLicense } from './models/fishing-license.model'
import { FishingLicenseService } from '../lib/fishing-license.service'

@UseGuards(IdsUserGuard, IdsAuthGuard, ScopesGuard)
@Resolver()
export class FishingLicenseResolver {
  constructor(private fishingLicenseService: FishingLicenseService) {}

  @Query(() => [Ship], {
    name: 'ships',
    nullable: true,
  })
  @Audit()
  async shipQuery(@CurrentUser() user: User): Promise<Ship[]> {
    return await this.fishingLicenseService.getShips(user.nationalId, user)
  }

  @Query(() => [FishingLicense], { name: 'fishingLicenses' })
  @Audit()
  async fishingLicensesQuery(
    @Args('registrationNumber', { type: () => Number })
    registrationNumber: number,
    @CurrentUser() user: User,
  ) {
    console.log('getting fishings licelicieclei')
    return await this.fishingLicenseService.getFishingLicenses(
      registrationNumber,
      user,
    )
  }
}
