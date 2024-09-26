import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import type { ConfigType } from '@island.is/nest/config'
import { DownloadServiceConfig } from '@island.is/nest/config'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetCourtCaseInput } from '../dto/getCourtCaseInput'
import { GetSubpoenaInput } from '../dto/getSubpoenaInput'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { CourtCase } from '../models/courtCase.model'
import { CourtCases } from '../models/courtCases.model'
import { DefenseChoice } from '../models/defenseChoice.model'
import { Lawyers } from '../models/lawyers.model'
import { Subpoena } from '../models/subpoena.model'
import { LawAndOrderService } from './law-and-order.service'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/law-and-order' })
@FeatureFlag(Features.servicePortalLawAndOrderModuleEnabled)
export class LawAndOrderResolver {
  constructor(
    private readonly lawAndOrderService: LawAndOrderService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Scopes(ApiScope.lawAndOrder)
  @Query(() => CourtCases, {
    name: 'lawAndOrderCourtCasesList',
    nullable: true,
  })
  @Audit()
  getCourtCasesList(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.lawAndOrderService.getCourtCases(user, locale)
  }

  @Scopes(ApiScope.lawAndOrder)
  @Query(() => CourtCase, {
    name: 'lawAndOrderCourtCaseDetail',
    nullable: true,
  })
  @Audit()
  getCourtCaseDetail(
    @CurrentUser() user: User,
    @Args('input') input: GetCourtCaseInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.lawAndOrderService.getCourtCase(user, input.id, locale)
  }

  @Scopes(ApiScope.lawAndOrder)
  @Query(() => Subpoena, { name: 'lawAndOrderSubpoena', nullable: true })
  @Audit()
  getSubpoena(
    @CurrentUser() user: User,
    @Args('input') input: GetSubpoenaInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.lawAndOrderService.getSubpoena(user, input.id, locale)
  }

  @Scopes(ApiScope.lawAndOrder)
  @Query(() => Lawyers, { name: 'lawAndOrderLawyers', nullable: true })
  @Audit()
  getLawyers(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.lawAndOrderService.getLawyers(user, locale)
  }

  @Scopes(ApiScope.lawAndOrder)
  @Mutation(() => DefenseChoice, {
    name: 'lawAndOrderDefenseChoicePost',
    nullable: true,
  })
  @Audit()
  postDefenseChoice(
    @Args('input') input: PostDefenseChoiceInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ) {
    return this.lawAndOrderService.postDefenseChoice(user, input, locale)
  }
}
