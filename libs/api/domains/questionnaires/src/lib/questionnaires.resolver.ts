import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AnsweredQuestionnaires } from '../models/answeredQuestion.model'
import { Questionnaire } from '../models/questionnaire.model'
import { QuestionnairesList } from '../models/questionnaires.model'
import {
  GetQuestionnaireInput,
  QuestionnaireAnsweredInput,
  QuestionnaireInput,
} from './dto/questionnaire.input'
import { QuestionnairesResponse } from './dto/response.dto'
import { QuestionnairesService } from './questionnaires.service'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/questionnaires' })
@Scopes(ApiScope.internal, ApiScope.health)
@FeatureFlag(Features.isServicePortalHealthQuestionnairesPageEnabled)
export class QuestionnairesResolver {
  constructor(
    private readonly questionnairesService: QuestionnairesService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => QuestionnairesList, {
    name: 'questionnairesList',
    nullable: true,
  })
  async getQuestionnaires(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String }) locale: Locale = 'is',
  ): Promise<QuestionnairesList | null> {
    return this.questionnairesService.getQuestionnaires(user, locale)
  }

  @Query(() => Questionnaire, { name: 'questionnairesDetail', nullable: true })
  async getQuestionnaire(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String }) locale: Locale = 'is',
    @Args('input') input: GetQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    return this.questionnairesService.getQuestionnaire(user, locale, input)
  }

  @Query(() => AnsweredQuestionnaires, {
    name: 'getAnsweredQuestionnaire',
    nullable: true,
  })
  async getAnsweredQuestionnaire(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String }) locale: Locale = 'is',
    @Args('input') input: QuestionnaireAnsweredInput,
  ): Promise<AnsweredQuestionnaires | null> {
    return this.questionnairesService.getAnsweredQuestionnaire(
      user,
      locale,
      input,
    )
  }

  @Mutation(() => QuestionnairesResponse, { name: 'submitQuestionnaire' })
  async submitQuestionnaire(
    @CurrentUser() user: User,
    @Args('input') input: QuestionnaireInput,
    @Args('locale', { type: () => String }) locale: Locale = 'is',
  ): Promise<QuestionnairesResponse> {
    return this.questionnairesService.submitQuestionnaire(user, input, locale)
  }
}
