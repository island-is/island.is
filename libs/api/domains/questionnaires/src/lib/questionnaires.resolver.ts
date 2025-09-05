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
import { QuestionnairesService } from './questionnaires.service'
import {
  Questionnaire,
  QuestionnairesList,
} from '../models/questionnaires.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/questionnaires' })
@Scopes(ApiScope.health)
export class QuestionnairesResolver {
  constructor(
    private readonly questionnairesService: QuestionnairesService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => QuestionnairesList, { name: 'questionnairesList' })
  async getQuestionnaires(
    @CurrentUser() user: User,
    @Args('locale') locale: Locale,
  ) {
    return this.questionnairesService.getQuestionnaires(user, locale)
  }

  @Query(() => Questionnaire, { name: 'questionnairesDetail' })
  async getQuestionnaire(
    @CurrentUser() user: User,
    @Args('locale') locale: Locale,
    @Args('id') id: string,
  ) {
    return this.questionnairesService.getQuestionnaire(user, id)
  }
}
