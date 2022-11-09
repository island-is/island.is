import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards, Inject } from '@nestjs/common'

import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import {
  ApplicationModel,
  CreateFilesModel,
  DirectTaxPaymentsResponse,
  MunicipalityModel,
  PersonalTaxReturnResponse,
  SignedUrlModel,
  SpouseEmailResponse,
} from './models'
import {
  CreateSignedUrlInput,
  MunicipalityInput,
  PersonalTaxReturnInput,
  ApplicationInput,
  ApplicationFilesInput,
  UpdateApplicationInput,
  GetSignedUrlInput,
  SpouseEmailInput,
} from './dto'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MunicipalitiesFinancialAidResolver {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private municipalitiesFinancialAidService: MunicipalitiesFinancialAidService,
  ) {}

  @Query(() => String, { nullable: true })
  async municipalitiesFinancialAidCurrentApplication(
    @CurrentUser() user: User,
  ): Promise<string | null> {
    try {
      return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidCurrentApplication(
        user,
      )
    } catch (e) {
      this.logger.error(`municipalitiesFinancialAidCurrentApplication`, e)
    }
    return null
  }

  @Query(() => MunicipalityModel, { nullable: true })
  async municipalitiesFinancialAidMunicipality(
    @Args('input', { type: () => MunicipalityInput })
    input: MunicipalityInput,
    @CurrentUser() user: User,
  ): Promise<MunicipalityModel | null> {
    try {
      return await this.municipalitiesFinancialAidService.municipalityInfoForFinancialAId(
        user,
        input,
      )
    } catch (e) {
      this.logger.error(`municipalitiesFinancialAidMunicipality`, e)
    }
    return null
  }

  @Query(() => PersonalTaxReturnResponse)
  async municipalitiesPersonalTaxReturn(
    @Args('input', { type: () => PersonalTaxReturnInput })
    input: PersonalTaxReturnInput,
    @CurrentUser() user: User,
  ): Promise<PersonalTaxReturnResponse> {
    try {
      return await this.municipalitiesFinancialAidService.personalTaxReturnForFinancialAId(
        user,
        input.id,
      )
    } catch (e) {
      this.logger.error(`municipalitiesPersonalTaxReturn`, e)
    }
    return {}
  }

  @Query(() => DirectTaxPaymentsResponse)
  async municipalitiesDirectTaxPayments(
    @CurrentUser() user: User,
  ): Promise<DirectTaxPaymentsResponse> {
    try {
      return await this.municipalitiesFinancialAidService.directTaxPaymentsForFinancialAId(
        user,
      )
    } catch (e) {
      this.logger.error(`municipalitiesDirectTaxPayments`, e)
    }
    return {}
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

  @Mutation(() => SpouseEmailResponse)
  async sendMunicipalitiesFinancialAidSpouseEmail(
    @Args('input', { type: () => SpouseEmailInput })
    input: SpouseEmailInput,
    @CurrentUser() user: User,
  ): Promise<SpouseEmailResponse> {
    return await this.municipalitiesFinancialAidService.municipalitiesFinancialAidSpouseEmail(
      user,
      input,
    )
  }
}
