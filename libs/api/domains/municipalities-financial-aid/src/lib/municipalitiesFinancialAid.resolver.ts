import { Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MunicipalitiesFinancialAidResolver {
  constructor(
    private municipalitiesFinancialAidService: MunicipalitiesFinancialAidService,
  ) {}

  @Query(() => String, { nullable: true })
  async hasUserFinancialAidApplicationForCurrentPeriod(
    @CurrentUser() user: User,
  ): Promise<string | null> {
    const currentApplication = await this.municipalitiesFinancialAidService.municipalitiesFinancialAidCurrentApplication(
      user,
      user.nationalId,
    )
    return currentApplication.currentApplicationId
  }
}
