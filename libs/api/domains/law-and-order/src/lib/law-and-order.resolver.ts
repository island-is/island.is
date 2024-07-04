import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { LawAndOrderService } from './law-and-order.service'
import { GetCourtCaseInput } from '../dto/getCourtCaseInput'
import { CourtCases } from '../models/courtCases.model'
import { CourtCase } from '../models/courtCase.model'
import { GetSubpoenaInput } from '../dto/getSubpoenaInput'
import { Subpoena } from '../models/subpoena.model'
import { Lawyers } from '../models/lawyers.model'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { DefenseChoice } from '../models/defenseChoice.model'
import { PostSubpoenaAcknowledgedInput } from '../dto/postSubpeonaAcknowledgedInput.model'
import { SubpoenaAcknowledged } from '../models/subpoenaAcknowledged.model'
import { GetCourtCasesInput } from '../dto/getCourtCasesInput.model'
import { GetLawyersInput } from '../dto/getLawyers'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/law-and-order' })
export class LawAndOrderResolver {
  constructor(
    private readonly lawAndOrderService: LawAndOrderService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  //@Scopes(ApiScope.lawAndOrder)
  @Query(() => CourtCases, {
    name: 'lawAndOrderCourtCasesList',
    nullable: true,
  })
  @Audit()
  async getCourtCasesList(
    @CurrentUser() user: User,
    @Args('input') input: GetCourtCasesInput,
  ) {
    return this.lawAndOrderService.getCourtCases(user, input.locale)
  }

  //@Scopes(ApiScope.lawAndOrder)
  @Query(() => CourtCase, {
    name: 'lawAndOrderCourtCaseDetail',
    nullable: true,
  })
  @Audit()
  async getCourtCaseDetail(
    @CurrentUser() user: User,
    @Args('input') input: GetCourtCaseInput,
  ) {
    return this.lawAndOrderService.getCourtCase(user, input.id, input.locale)
  }

  //@Scopes(ApiScope.lawAndOrder)
  @Query(() => Subpoena, { name: 'lawAndOrderSubpoena', nullable: true })
  @Audit()
  async getSubpoena(
    @CurrentUser() user: User,
    @Args('input') input: GetSubpoenaInput,
  ) {
    return this.lawAndOrderService.getSubpoena(user, input.id, input.locale)
  }

  //@Scopes(ApiScope.lawAndOrder)
  @Query(() => Lawyers, { name: 'lawAndOrderLawyers', nullable: true })
  @Audit()
  async getLawyers(
    @CurrentUser() user: User,
    @Args('input') input: GetLawyersInput,
  ) {
    return this.lawAndOrderService.getLawyers(user, input.locale)
  }

  @Mutation(() => DefenseChoice, {
    name: 'lawAndOrderDefenseChoicePost',
    nullable: true,
  })
  @Audit()
  async postDefenseChoice(
    @Args('input') input: PostDefenseChoiceInput,
    @CurrentUser() user: User,
  ) {
    return this.lawAndOrderService.postDefenseChoice(user, {
      ...input,
    })
  }

  @Mutation(() => SubpoenaAcknowledged, {
    name: 'lawAndOrderSubpoenaAcknowledged',
    nullable: true,
  })
  @Audit()
  async postSubpoenaAcknowledged(
    @Args('input') input: PostSubpoenaAcknowledgedInput,
    @CurrentUser() user: User,
  ) {
    return this.lawAndOrderService.postSubpoenaAcknowledged(user, {
      ...input,
    })
  }
}
