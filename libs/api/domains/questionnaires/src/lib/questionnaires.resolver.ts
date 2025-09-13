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
import { Args, Query, Resolver } from '@nestjs/graphql'
import {
  Questionnaire,
  QuestionnairesList,
} from '../models/questionnaires.model'
import { QuestionnairesService } from './questionnaires.service'

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
    @Args('locale', { type: () => String }) locale: Locale = 'is',
    @Args('id') id: string,
  ): Promise<Questionnaire | null> {
    return this.questionnairesService.getQuestionnaire(user, id)
  }
}
