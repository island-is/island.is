import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import {
  ApplicationModel,
  CreateFilesModel,
  DirectTaxPaymentsResponse,
  MunicipalityModel,
  PersonalTaxReturnResponse,
  SignedUrlModel,
} from './models'
import {
  CreateSignedUrlInput,
  MunicipalityInput,
  PersonalTaxReturnInput,
  ApplicationInput,
  ApplicationFilesInput,
  UpdateApplicationInput,
  GetSignedUrlInput,
} from './dto'

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

  @Query(() => PersonalTaxReturnResponse)
  async municipalitiesPersonalTaxReturn(
    @Args('input', { type: () => PersonalTaxReturnInput })
    input: PersonalTaxReturnInput,
    @CurrentUser() user: User,
  ): Promise<PersonalTaxReturnResponse> {
    return await this.municipalitiesFinancialAidService.personalTaxReturnForFinancialAId(
      user,
      input.id,
    )
  }

  @Query(() => DirectTaxPaymentsResponse)
  async municipalitiesDirectTaxPayments(
    @CurrentUser() user: User,
  ): Promise<DirectTaxPaymentsResponse> {
    return await this.municipalitiesFinancialAidService.directTaxPaymentsForFinancialAId(
      user,
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

  @Query(() => ApplicationModel, { nullable: true })
  async municipalitiesFinancialAidApplication(
    @Args('input', { type: () => ApplicationInput })
    input: ApplicationInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationModel | null> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidApplication(
      user,
      input,
    )
  }

  @Mutation(() => CreateFilesModel)
  async createMunicipalitiesFinancialAidApplicationFiles(
    @Args('input', { type: () => ApplicationFilesInput })
    input: ApplicationFilesInput,
    @CurrentUser() user: User,
  ): Promise<CreateFilesModel> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidCreateFiles(
      user,
      input,
    )
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  async updateMunicipalitiesFinancialAidApplication(
    @Args('input', { type: () => UpdateApplicationInput })
    input: UpdateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationModel | null> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidUpdateApplication(
      user,
      input,
    )
  }

  @Query(() => SignedUrlModel)
  async municipalitiesFinancialAidApplicationSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<SignedUrlModel> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidGetSignedUrl(
      user,
      input,
    )
  }
}
