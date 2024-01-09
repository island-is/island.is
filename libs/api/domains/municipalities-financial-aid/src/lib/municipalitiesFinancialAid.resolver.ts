import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards, Inject } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { ApplicationModel, CreateFilesModel, SignedUrlModel } from './models'
import {
  CreateSignedUrlInput,
  ApplicationInput,
  ApplicationFilesInput,
  UpdateApplicationInput,
  GetSignedUrlInput,
} from './dto'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

// @UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MunicipalitiesFinancialAidResolver {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private municipalitiesFinancialAidService: MunicipalitiesFinancialAidService,
  ) {}

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

  @Query(() => [ApplicationModel], { nullable: true })
  async municipalitiesFinancialAidGetApplicationForPeriod(
    @CurrentUser() user: User,
  ): Promise<ApplicationModel[] | null> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidGetApplicationsForPeriod(
      user,
    )
  }
}
