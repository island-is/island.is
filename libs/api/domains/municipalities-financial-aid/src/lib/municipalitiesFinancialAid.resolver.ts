import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { MunicipalityModel } from './models/municipality.model'
import { MunicipalityQueryInput } from './models/municipality.input'
import { SignedUrlModel } from './models/signedUrl.model'
import { GetSignedUrlInput } from './dto/getSignedUrl.input'
import { ApplicationModel } from '@island.is/clients/municipalities-financial-aid'
import { CreateApplicationInput } from './dto/createApplication.input'
import { Application } from './models/application.model'

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
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidCurrentApplication(
      user,
    )
  }

  @Query(() => MunicipalityModel, { nullable: true })
  async municipalityInfoForFinancialAid(
    @Args('input', { type: () => MunicipalityQueryInput })
    input: MunicipalityQueryInput,
    @CurrentUser() user: User,
  ): Promise<MunicipalityModel | null> {
    return await this.municipalitiesFinancialAidService.municipalityInfoForFinancialAId(
      user,
      input,
    )
  }

  @Mutation(() => SignedUrlModel)
  getSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<SignedUrlModel | null> {
    return this.municipalitiesFinancialAidService.municipalitiesFinancialAidCreateSignedUrl(
      user,
      input,
    )
  }

  // @Mutation(() => Application, { nullable: true })
  // createApplication(
  //   @Args('input', { type: () => CreateApplicationInput })
  //   input: CreateApplicationInput,
  //   @CurrentUser() user: User,
  // ): Promise<ApplicationModel | undefined> {
  //   return Promise.resolve(undefined)
  //   // return this.municipalitiesFinancialAidService.municipalitiesFinancialAidCreateApplication(
  //   //   user,
  //   //   input,
  //   // )
  // }
}
