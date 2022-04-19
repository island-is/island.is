import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { MunicipalitiesFinancialAidMunicipalityModel, MunicipalitiesFinancialAidSignedUrlModel } from './models'
import { MunicipalitiesFinancialAidCreateSignedUrlInput, MunicipalitiesFinancialAidMunicipalityInput } from './dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MunicipalitiesFinancialAidResolver {
  constructor(
    private municipalitiesFinancialAidService: MunicipalitiesFinancialAidService,
  ) {}

  @Query(() => String, { nullable: true })
  async municipalitiesFinancialAidCurrentApplication(
    @CurrentUser() user: User,
  ): Promise<string | null> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidCurrentApplication(
      user,
    )
  }

  @Query(() => MunicipalitiesFinancialAidMunicipalityModel, { nullable: true })
  async municipalitiesFinancialAidMunicipality(
    @Args('input', { type: () => MunicipalitiesFinancialAidMunicipalityInput })
    input: MunicipalitiesFinancialAidMunicipalityInput,
    @CurrentUser() user: User,
  ): Promise<MunicipalitiesFinancialAidMunicipalityModel | null> {
    return await this.municipalitiesFinancialAidService.municipalityInfoForFinancialAId(
      user,
      input,
    )
  }

  @Mutation(() => MunicipalitiesFinancialAidSignedUrlModel)
  createMunicipalitiesFinancialAidSignedUrl(
    @Args('input', {
      type: () => MunicipalitiesFinancialAidCreateSignedUrlInput,
    })
    input: MunicipalitiesFinancialAidCreateSignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<MunicipalitiesFinancialAidSignedUrlModel | null> {
    return this.municipalitiesFinancialAidService.municipalitiesFinancialAidCreateSignedUrl(
      user,
      input,
    )
  }
}
