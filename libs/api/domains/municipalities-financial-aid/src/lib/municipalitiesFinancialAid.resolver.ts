import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { MunicipalityModel, SignedUrlModel } from './models'
import { CreateSignedUrlInput, MunicipalityInput } from './dto'

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

  @Query(() => MunicipalityModel, { nullable: true })
  async municipalitiesFinancialAidMunicipality(
    @Args('input', { type: () => MunicipalityInput })
    input: MunicipalityInput,
    @CurrentUser() user: User,
  ): Promise<MunicipalityModel | null> {
    return await this.municipalitiesFinancialAidService.municipalityInfoForFinancialAId(
      user,
      input,
    )
  }

  @Mutation(() => SignedUrlModel)
  createMunicipalitiesFinancialAidSignedUrl(
    @Args('input', {
      type: () => CreateSignedUrlInput,
    })
    input: CreateSignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<SignedUrlModel | null> {
    return this.municipalitiesFinancialAidService.municipalitiesFinancialAidCreateSignedUrl(
      user,
      input,
    )
  }
}
