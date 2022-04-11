import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { FinancialAidMunicipalityModel } from './models/municipality.model'
import { FinancialAidMunicipalityInput } from './models/municipality.input'
import { FinancialAidMunicipalitiesSignedUrlModel } from './models/signedUrl.model'
import { FinancialAidMunicipalitiesCreateSignedUrlInput } from './dto/getSignedUrl.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MunicipalitiesFinancialAidResolver {
  constructor(
    private municipalitiesFinancialAidService: MunicipalitiesFinancialAidService,
  ) {}

  @Query(() => String, { nullable: true })
  async financialAidMunicipalitiesCurrentApplication(
    @CurrentUser() user: User,
  ): Promise<string | null> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidCurrentApplication(
      user,
    )
  }

  @Query(() => FinancialAidMunicipalityModel, { nullable: true })
  async financialAidMunicipality(
    @Args('input', { type: () => FinancialAidMunicipalityInput })
    input: FinancialAidMunicipalityInput,
    @CurrentUser() user: User,
  ): Promise<FinancialAidMunicipalityModel | null> {
    return await this.municipalitiesFinancialAidService.municipalityInfoForFinancialAId(
      user,
      input,
    )
  }

  @Mutation(() => FinancialAidMunicipalitiesSignedUrlModel)
  createFinancialAidMunicipalitiesSignedUrl(
    @Args('input', {
      type: () => FinancialAidMunicipalitiesCreateSignedUrlInput,
    })
    input: FinancialAidMunicipalitiesCreateSignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<FinancialAidMunicipalitiesSignedUrlModel | null> {
    return this.municipalitiesFinancialAidService.municipalitiesFinancialAidCreateSignedUrl(
      user,
      input,
    )
  }
}
