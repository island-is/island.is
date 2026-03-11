import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { Inject, Injectable } from '@nestjs/common'
import {
  GetQuestionnaireInput,
  QuestionnaireAnsweredInput,
  QuestionnaireInput,
} from './dto/questionnaire.input'

import {
  HealthDirectorateHealthService,
  QuestionnaireDetailDto,
} from '@island.is/clients/health-directorate'

import {
  LshClientService,
  Questionnaire as LshQuestionnaireType,
} from '@island.is/clients/lsh'
import { IntlService } from '@island.is/cms-translations'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { AnsweredQuestionnaires } from '../models/answeredQuestion.model'
import { Questionnaire } from '../models/questionnaire.model'
import {
  QuestionnairesList,
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'
import { QuestionnairesResponse } from './dto/response.dto'
import { mapToElAnswer } from './transform-mappers/el/answer/mapToELAnswer'
import {
  mapElQuestionnaireForm,
  mapElQuestionnaireListItem,
  mapElQuestionnaireOverview,
} from './transform-mappers/el/display/mapQuestionnaire'
import { mapToLshAnswer } from './transform-mappers/lsh/answer/mapToLSHAnswer'
import {
  mapLshQuestionnaireForm,
  mapLshQuestionnaireOverview,
  mapLshQuestionnaireListItem,
} from './transform-mappers/lsh/display/mapQuestionnaire'
import { NAMESPACE } from './utils/constants'
import { m } from './utils/messages'

@Injectable()
export class QuestionnairesService {
  constructor(
    private api: HealthDirectorateHealthService,
    private lshApi: LshClientService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly intlService: IntlService,
    private readonly featureService: FeatureFlagService,
  ) {}

  async getQuestionnaires(
    user: User,
    locale: Locale,
  ): Promise<QuestionnairesList | null> {
    const { useEl, useLsh } = await this.getQuestionnaireFeatureFlags(user)
    let elError = false
    let lshError = false
    let elQuestionnaires: QuestionnairesList = { questionnaires: [] }
    let lshQuestionnaires: QuestionnairesList = { questionnaires: [] }

    if (useEl) {
      try {
        elQuestionnaires = await this.getElQuestionnaires(user, locale)
      } catch (error) {
        elError = true
        this.logger.error('Failed to fetch EL questionnaires', error)
      }
    }

    if (useLsh) {
      try {
        lshQuestionnaires = await this.getLshQuestionnaires(user, locale)
      } catch (error) {
        lshError = true
        this.logger.error('Failed to fetch LSH questionnaires', error)
      }
    }

    const allEnabledFailed =
      (useEl && elError && !useLsh) ||
      (useLsh && lshError && !useEl) ||
      (elError && lshError)

    if (allEnabledFailed) {
      throw new Error(
        `Failed to fetch questionnaires from both sources: EL and LSH`,
      )
    }

    return {
      questionnaires: [elQuestionnaires, lshQuestionnaires]
        .flatMap((list) => list.questionnaires)
        .filter((q) => q !== undefined)
        .sort((a, b) => {
          const aIsExpired = a.status === QuestionnairesStatusEnum.expired
          const bIsExpired = b.status === QuestionnairesStatusEnum.expired

          if (aIsExpired && !bIsExpired) return 1
          if (!aIsExpired && bIsExpired) return -1

          const dateA = Date.parse(a.sentDate) || 0
          const dateB = Date.parse(b.sentDate) || 0

          return dateB - dateA
        }),
    }
  }

  async getQuestionnaire(
    user: User,
    locale: Locale,
    input: GetQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    const { useEl, useLsh } = await this.getQuestionnaireFeatureFlags(user)

    if (input.organization === QuestionnairesOrganizationEnum.LSH && useLsh) {
      return this.getLshQuestionnaire(user, locale, input)
    }

    if (input.organization === QuestionnairesOrganizationEnum.EL && useEl) {
      return this.getElQuestionnaire(user, locale, input)
    }

    return null
  }

  async submitQuestionnaire(
    user: User,
    input: QuestionnaireInput,
    locale: Locale,
  ): Promise<QuestionnairesResponse> {
    const organization = this.normalizeOrganization(input.organization)
    if (!organization) {
      return {
        success: false,
        message: 'Organization is required to submit questionnaire',
      }
    }

    const { useEl, useLsh } = await this.getQuestionnaireFeatureFlags(user)

    if (organization === QuestionnairesOrganizationEnum.LSH && useLsh) {
      return this.submitLshQuestionnaire(user, input, locale)
    }

    if (organization === QuestionnairesOrganizationEnum.EL && useEl) {
      return this.submitElQuestionnaire(user, input, locale)
    }

    return {
      success: false,
      message: 'Organization not recognized or provider is unavailable',
    }
  }

  private async submitLshQuestionnaire(
    user: User,
    input: QuestionnaireInput,
    locale: Locale,
  ): Promise<QuestionnairesResponse> {
    try {
      const lshAnswer = mapToLshAnswer(input)
      const response = await this.lshApi.postAnsweredQuestionnaire(
        user,
        locale,
        lshAnswer.gUID ?? input.id,
        lshAnswer,
      )
      return {
        success: true,
        message: response?.message ?? 'Questionnaire submitted successfully',
      }
    } catch (e) {
      return {
        success: false,
        message: 'Error submitting questionnaire to LSH',
      }
    }
  }

  private async submitElQuestionnaire(
    user: User,
    input: QuestionnaireInput,
    locale: Locale,
  ): Promise<QuestionnairesResponse> {
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    try {
      const elAnswer = mapToElAnswer(input, formatMessage)
      const response = await this.api.submitQuestionnaire(
        user,
        locale,
        input.id,
        elAnswer,
      )
      return {
        success: true,
        message: response?.toString(),
      }
    } catch (e) {
      return {
        success: false,
        message: 'Error submitting questionnaire to EL',
      }
    }
  }

  async getAnsweredQuestionnaire(
    user: User,
    locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<AnsweredQuestionnaires | null> {
    const organization = this.normalizeOrganization(input.organization)

    const { useEl, useLsh } = await this.getQuestionnaireFeatureFlags(user)

    if (!organization || !input.id) {
      return null
    }

    if (
      organization === QuestionnairesOrganizationEnum.EL &&
      input.submissionId &&
      useEl
    ) {
      return this.getElAnsweredQuestionnaire(
        user,
        locale,
        input.id,
        input.submissionId,
      )
    }

    if (organization === QuestionnairesOrganizationEnum.LSH && useLsh) {
      return this.getLshAnsweredQuestionnaire(user, locale, input)
    }

    return null
  }

  // Get Questionnaires Lists
  private async getElQuestionnaires(
    user: User,
    locale: Locale,
  ): Promise<QuestionnairesList> {
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    const data = await this.api.getQuestionnaires(user, locale)

    return {
      questionnaires: (data ?? []).map((q) =>
        mapElQuestionnaireListItem(q, formatMessage),
      ),
    }
  }

  private async getLshQuestionnaires(
    user: User,
    locale: Locale,
  ): Promise<QuestionnairesList> {
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    const data = await this.lshApi.getQuestionnaires(user, locale)

    return {
      questionnaires: (data ?? [])
        .filter((item) => item.gUID != null)
        .map((item) => mapLshQuestionnaireListItem(item, formatMessage)),
    }
  }

  private async getElAnsweredQuestionnaire(
    user: User,
    locale: Locale,
    questionnaireId: string,
    submissionId: string,
  ): Promise<AnsweredQuestionnaires | null> {
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    try {
      const ELdata = await this.api.getQuestionnaireAnswered(
        user,
        locale,
        questionnaireId,
        submissionId,
      )

      if (!ELdata) {
        return null
      }

      const repliesMap = new Map(
        ELdata.replies?.map((reply) => [reply.questionId, reply]) ?? [],
      )

      const submission = {
        id: questionnaireId,
        title: ELdata.title ?? formatMessage(m.questionnaireWithoutTitle),
        isDraft: ELdata.submission.isDraft ?? false,
        description: ELdata.message ?? undefined,
        date:
          this.formatDate(ELdata.submission?.submittedDate) ??
          this.formatDate(ELdata.submission?.lastUpdatedDate),

        answers:
          ELdata.groups
            ?.flatMap(
              (group) =>
                group.items?.map((item) => {
                  const reply = repliesMap.get(item.id)

                  // Extract values based on reply type
                  let values: string[] = []
                  if (reply) {
                    if ('values' in reply) {
                      // ListReplyDto
                      values = reply.values.map((v) => v.answer)
                    } else if ('answer' in reply) {
                      if (reply.answer === true || reply.answer === false) {
                        // BooleanReplyDto
                        values = [
                          reply.answer
                            ? formatMessage(m.yes)
                            : formatMessage(m.no),
                        ]
                      } else {
                        // StringReplyDto, NumberReplyDto, DateReplyDto
                        values = [String(reply.answer)]
                      }
                    }
                  }

                  return {
                    id: item.id,
                    label: item.label ?? formatMessage(m.noLabel),
                    values,
                  }
                }) ?? [],
            )
            .filter((answer) => answer != null) ?? [],
      }

      return {
        data: [submission],
      }
    } catch (error) {
      return null
    }
  }

  private async getLshAnsweredQuestionnaire(
    user: User,
    locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<AnsweredQuestionnaires | null> {
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    const LSHdata = await this.lshApi.getAnsweredQuestionnaire(
      user,
      locale,
      input.id,
    )

    const LSHquestionnaire = await this.lshApi.getQuestionnaire(
      user,
      locale,
      input.id,
    )

    if (!LSHdata || !LSHdata.answers) {
      return null
    }

    if (!LSHdata.gUID) {
      this.logger.warn('LSH answered questionnaire is missing gUID', {
        submissionId: input.submissionId,
      })
      return null
    }

    const data = {
      id: LSHdata.gUID,
      title:
        LSHquestionnaire?.header ?? formatMessage(m.questionnaireWithoutTitle),
      description: LSHquestionnaire?.description ?? undefined,
      date: this.formatDate(LSHdata.answerDateTime),
      answers: LSHdata.answers?.flatMap((answer) => {
        if (!answer.entryID) {
          this.logger.warn('Skipping LSH answer with missing entryID', {
            submissionId: input.submissionId,
          })
          return []
        }

        // Search through all sections to find the matching question
        const question = LSHquestionnaire?.sections
          ?.flatMap((section) => section.questions ?? [])
          .find((q) => q.entryID === answer.entryID)

        // Map values to their labels from the question options
        const valueLabels =
          answer.values?.map((value) => {
            const option = question?.options?.find((opt) => opt.value === value)
            return option?.label ?? value
          }) ?? []

        return [
          {
            id: answer.entryID,
            label: question?.question ?? formatMessage(m.noLabel),
            values: valueLabels,
          },
        ]
      }),
    }

    return { data: [data] }
  }

  private async getLshQuestionnaire(
    user: User,
    locale: Locale,
    input: GetQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )

    if (input.includeQuestions) {
      const lshQuestionnaireWithQuestions = await this.lshApi.getQuestionnaire(
        user,
        locale,
        input.id,
      )

      if (!lshQuestionnaireWithQuestions) {
        return null
      }

      return mapLshQuestionnaireForm(
        lshQuestionnaireWithQuestions,
        formatMessage,
      )
    }

    const lshQuestionnaires = await this.lshApi.getQuestionnaires(user, locale)
    const lshQuestionnaire: LshQuestionnaireType | null =
      lshQuestionnaires?.find((q) => q.gUID === input.id) ?? null

    if (!lshQuestionnaire) return null
    return mapLshQuestionnaireOverview(lshQuestionnaire, formatMessage)
  }

  private async getElQuestionnaire(
    user: User,
    locale: Locale,
    input: GetQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    const elData: QuestionnaireDetailDto | null =
      await this.api.getQuestionnaire(user, locale, input.id)
    if (!elData) return null
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    return input.includeQuestions
      ? mapElQuestionnaireForm(elData, formatMessage)
      : mapElQuestionnaireOverview(elData, formatMessage)
  }

  private formatDate(date?: Date | string | null): string | undefined {
    if (!date) return undefined
    if (date instanceof Date) return date.toDateString()
    if (typeof date === 'string') {
      const parsed = new Date(date)
      return isNaN(parsed.getTime()) ? date : parsed.toDateString()
    }
    return undefined
  }

  private async getQuestionnaireFeatureFlags(user: User): Promise<{
    useEl: boolean
    useLsh: boolean
  }> {
    const useEl = await this.featureService.getValue(
      Features.questionnairesFromEL,
      false,
      user,
    )
    const useLsh = await this.featureService.getValue(
      Features.questionnairesFromLSH,
      false,
      user,
    )

    return { useEl, useLsh }
  }

  /**
   * Helper method to normalize organization string to enum
   */
  private normalizeOrganization(
    org: string,
  ): QuestionnairesOrganizationEnum | null {
    const normalized = org.toUpperCase()
    if (normalized === QuestionnairesOrganizationEnum.LSH) {
      return QuestionnairesOrganizationEnum.LSH
    }
    if (normalized === QuestionnairesOrganizationEnum.EL) {
      return QuestionnairesOrganizationEnum.EL
    }
    return null
  }
}
