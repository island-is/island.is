import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Audit, AuditService } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QuestionnairesList } from '../models/questionnaires.model'
import { Questionnaire } from '../models/questionnaire.model'
import {
  QuestionnaireAnsweredInput,
  QuestionnaireInput,
} from './dto/questionnaire.input'
import { QuestionnairesService } from './questionnaires.service'
import { QuestionnaireSubmission } from '../models/submission.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/questionnaires' })
//TODO: add scope
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
    @Args('locale', { type: () => String }) _locale: Locale = 'is',
    @Args('id') id: string,
  ): Promise<Questionnaire | null> {
    return this.questionnairesService.getQuestionnaire(user, id)
  }

  @Query(() => QuestionnaireSubmission, {
    name: 'getAnsweredQuestionnaire',
    nullable: true,
  })
  async getAnsweredQuestionnaire(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String }) locale: Locale = 'is',
    @Args('input') input: QuestionnaireAnsweredInput,
  ): Promise<QuestionnaireSubmission | null> {
    return this.questionnairesService.getAnsweredQuestionnaire(
      user,
      locale,
      input,
    )
  }

  @Mutation(() => Boolean, { name: 'submitQuestionnaire' })
  async submitQuestionnaire(
    @CurrentUser() user: User,
    @Args('input') input: QuestionnaireInput,
  ): Promise<boolean> {
    return this.questionnairesService.submitQuestionnaire(user, input)
  }
}
