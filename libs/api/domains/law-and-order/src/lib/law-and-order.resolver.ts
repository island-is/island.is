import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
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
import { Subpoena } from '../models/summon.model'
import { LawAndOrderService } from './law-and-order.service'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'law-and-order-resolver'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/law-and-order' })
@Scopes(ApiScope.lawAndOrder)
export class LawAndOrderResolver {
  constructor(
    private readonly lawAndOrderService: LawAndOrderService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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

  @Query(() => CourtCase, {
    name: 'lawAndOrderCourtCaseDetail',
    nullable: true,
  })
  @Audit()
  async getCourtCaseDetail(
    @CurrentUser() user: User,
    @Args('input') input: GetCourtCaseInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.auditAndHandle(
      'getCourtCaseDetail',
      input.id,
      this.lawAndOrderService.getCourtCase(user, input.id, locale),
      user,
    )
  }

  @Query(() => Subpoena, { name: 'lawAndOrderSubpoena', nullable: true })
  @Audit()
  async getSubpoena(
    @CurrentUser() user: User,
    @Args('input') input: GetSubpoenaInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.auditAndHandle(
      'getSubpoena',
      input.id,
      this.lawAndOrderService.getSummon(user, input.id, locale),
      user,
    )
  }

  @Query(() => Lawyers, { name: 'lawAndOrderLawyers', nullable: true })
  @Audit()
  getLawyers(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.auditAndHandle(
      'getLawyers',
      'lawyers',
      this.lawAndOrderService.getLawyers(user, locale),
      user,
    )
  }

  @Mutation(() => DefenseChoice, {
    name: 'lawAndOrderDefenseChoicePost',
    nullable: true,
  })
  @Audit()
  async postDefenseChoice(
    @Args('input') input: PostDefenseChoiceInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ) {
    return this.auditAndHandle(
      'postDefenseChoice',
      input.caseId,
      this.lawAndOrderService.postDefenseChoice(user, input, locale),
      user,
      { defenseChoice: input.choice },
    )
  }

  private async auditAndHandle<T>(
    actionName: string,
    resources: string,
    promise: Promise<T>,
    user: User,
    meta?: any,
  ): Promise<T> {
    try {
      return await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/law-and-order',
          action: actionName,
          resources: resources,
          meta: meta,
        },
        promise,
      )
    } catch (e) {
      this.logger.error(`Failed to ${actionName}`, {
        category: LOG_CATEGORY,
        id: resources,
        error: e,
      })
      throw e
    }
  }
}
