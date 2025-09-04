import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject, UseGuards } from '@nestjs/common'
import type { Locale } from '@island.is/shared/types'
import { Audit, AuditService } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { QuestionnariesService } from './questionnaries.service'
import { QuestionnariesList } from '../models/questionnaries.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/questionnaries' })
@Scopes(ApiScope.health)
export class QuestionnariesResolver {
  constructor(
    private readonly questionnariesService: QuestionnariesService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => QuestionnariesList, { name: 'questionnairesList' })
  async getQuestionnaires(
    @CurrentUser() user: User,
    @Args('locale') locale: Locale,
  ) {
    return this.questionnariesService.getQuestionnaires(user, locale)
  }
}
