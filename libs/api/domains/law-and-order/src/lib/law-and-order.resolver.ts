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
import { Subpoena } from '../models/subpoena.model'
import { LawAndOrderService } from './law-and-order.service'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'law-and-order-resolver'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/law-and-order' })
@FeatureFlag(Features.servicePortalLawAndOrderModuleEnabled)
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
    try {
      return await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/law-and-order',
          action: 'getCourtCaseDetail',
          resources: input.id,
        },
        this.lawAndOrderService.getCourtCase(user, input.id, locale),
      )
    } catch (e) {
      this.logger.info('failed to get single court case', {
        category: LOG_CATEGORY,
        id: input.id,
        error: e,
      })
      throw e
    }
  }

  @Query(() => Subpoena, { name: 'lawAndOrderSubpoena', nullable: true })
  @Audit()
  async getSubpoena(
    @CurrentUser() user: User,
    @Args('input') input: GetSubpoenaInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    try {
      return await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/law-and-order',
          action: 'getSubpoena',
          resources: input.id,
        },
        this.lawAndOrderService.getSubpoena(user, input.id, locale),
      )
    } catch (e) {
      this.logger.info('failed to get subpoena for court case', {
        category: LOG_CATEGORY,
        id: input.id,
        error: e,
      })
      throw e
    }
  }

  @Query(() => Lawyers, { name: 'lawAndOrderLawyers', nullable: true })
  @Audit()
  getLawyers(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.lawAndOrderService.getLawyers(user, locale)
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
    try {
      return await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/law-and-order',
          action: 'postDefenseChoice',
          resources: input.caseId,
          meta: { defenseChoice: input.choice },
        },
        this.lawAndOrderService.postDefenseChoice(user, input, locale),
      )
    } catch (e) {
      this.logger.info('failed to patch defender choice for subpoena ', {
        category: LOG_CATEGORY,
        id: input.caseId,
        error: e,
      })
      throw e
    }
  }
}
