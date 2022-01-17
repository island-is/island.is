import { Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { CurrentApplicationResponse } from './dto/currentApplication'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MunicipalitiesFinancialAidResolver {
  constructor(
    private municipalitiesFinancialAidService: MunicipalitiesFinancialAidService,
  ) {}

  @Query(() => CurrentApplicationResponse, { nullable: true })
  async hasUserFinancialAidApplicationForCurrentPeriod(
    @CurrentUser() user: User,
  ): Promise<CurrentApplicationResponse> {
    const currentApplicationId = await this.municipalitiesFinancialAidService.hasUserApplicationForCurrentPeriod(
      user,
      user.nationalId,
    )
    return { currentApplicationId }
  }
}
