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
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
} from '@island.is/clients/health-directorate'

import {
  LshClientService,
  Questionnaire as LSHQuestionnaireType,
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
import { mapELQuestionnaire } from './transform-mappers/el/display/mapQuestionnaire'
import { mapToLshAnswer } from './transform-mappers/lsh/answer/mapToLSHAnswer'
import { mapLshQuestionnaire } from './transform-mappers/lsh/display/mapQuestionnaire'
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

  async getQuestionnaire(
    user: User,
    locale: Locale,
    input: GetQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    const useEL = await this.featureService.getValue(
      Features.questionnairesFromEL,
      false,
      user,
    )
    const useLSH = await this.featureService.getValue(
      Features.questionnairesFromLSH,
      false,
      user,
    )

    // Fetch questionnaire from LSH
    if (input.organization === QuestionnairesOrganizationEnum.LSH && useLSH) {
      if (input.includeQuestions) {
        // Fetch full questionnaire including sections and questions
        const lshQuestionnaireWithQuestions =
          await this.lshApi.getQuestionnaire(user, locale, input.id)

        if (!lshQuestionnaireWithQuestions) {
          return null
        }

        return mapLshQuestionnaire(lshQuestionnaireWithQuestions)
      }

      // Otherwise fetch the list and select the matching questionnaire header
      const lshQuestionnaires = await this.lshApi.getQuestionnaires(
        user,
        locale,
      )
      const lshQuestionnaire: LSHQuestionnaireType | null =
        lshQuestionnaires?.find((q) => q.gUID === input.id) ?? null

      return await this.getLSHQuestionnaire(locale, lshQuestionnaire)
    }

    if (input.organization === QuestionnairesOrganizationEnum.EL && useEL) {
      // Fetch questionnaire from EL (Health Directorate)
      const elData: QuestionnaireDetailDto | null =
        await this.api.getQuestionnaire(user, locale, input.id)

      return this.getELQuestionnaire(locale, input.includeQuestions, elData)
    }

    return null
  }

  async getAnsweredQuestionnaire(
    user: User,
    locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<AnsweredQuestionnaires | null> {
    const organization = this.normalizeOrganization(input.organization)

    const useEL = await this.featureService.getValue(
      Features.questionnairesFromEL,
      false,
      user,
    )
    const useLSH = await this.featureService.getValue(
      Features.questionnairesFromLSH,
      false,
      user,
    )

    if (!organization || !input.id) {
      return null
    }

    if (
      organization === QuestionnairesOrganizationEnum.EL &&
      input.submissionId &&
      useEL
    ) {
      return this.getELAnsweredQuestionnaire(
        user,
        locale,
        input.id,
        input.submissionId,
      )
    }

    if (organization === QuestionnairesOrganizationEnum.LSH && useLSH) {
      return this.getLSHAnsweredQuestionnaire(user, locale, input)
    }

    return null
  }

  // Build answered questionnaire response for EL (Health Directorate)
  private async getELAnsweredQuestionnaire(
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

  private async getLSHAnsweredQuestionnaire(
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

    const data = {
      id: LSHdata.gUID ?? 'undefined-id',
      title:
        LSHquestionnaire?.header ?? formatMessage(m.questionnaireWithoutTitle),
      description: LSHquestionnaire?.description ?? undefined,
      date: this.formatDate(LSHdata.answerDateTime),
      answers: LSHdata.answers?.map((answer) => {
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

        return {
          id: answer.entryID ?? 'undefined-id',
          label: question?.question ?? formatMessage(m.noLabel),
          values: valueLabels,
        }
      }),
    }

    return { data: [data] }
  }

  async submitQuestionnaire(
    user: User,
    input: QuestionnaireInput,
    locale: Locale,
  ): Promise<QuestionnairesResponse> {
    const organization = this.normalizeOrganization(input.organization)
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    if (!organization) {
      return {
        success: false,
        message: 'Organization is required to submit questionnaire',
      }
    }

    // Submit to LSH
    if (organization === QuestionnairesOrganizationEnum.LSH) {
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

    // Submit to EL (Health Directorate)
    if (organization === QuestionnairesOrganizationEnum.EL) {
      try {
        const elAnswer = mapToElAnswer(input, formatMessage)
        const response = await this.api.submitQuestionnaire(
          user,
          locale,
          input.id, // questionnaire ID
          elAnswer, // SubmitQuestionnaireDto
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

    return {
      success: false,
      message: 'Unknown organization',
    }
  }

  async getQuestionnaires(
    user: User,
    locale: Locale,
  ): Promise<QuestionnairesList | null> {
    let ELquestionnaires: QuestionnairesList = { questionnaires: [] }
    let ELError = false
    let LSHerror = false
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )
    const useEL = await this.featureService.getValue(
      Features.questionnairesFromEL,
      false,
      user,
    )
    const useLSH = await this.featureService.getValue(
      Features.questionnairesFromLSH,
      false,
      user,
    )
    if (useEL) {
      try {
        const data: QuestionnaireBaseDto[] | null =
          await this.api.getQuestionnaires(user, locale)
        ELquestionnaires = {
          questionnaires:
            (data ?? []).map((q) => {
              return {
                id: q.questionnaireId,
                title: q.title ?? formatMessage(m.questionnaireWithoutTitle),
                description: q.message ?? undefined,
                sentDate: q.createdDate?.toISOString() ?? '',
                organization: QuestionnairesOrganizationEnum.EL,
                department: undefined,
                status:
                  q.numSubmitted > 0 || q.lastSubmitted
                    ? QuestionnairesStatusEnum.answered
                    : q.hasDraft
                    ? QuestionnairesStatusEnum.draft
                    : QuestionnairesStatusEnum.notAnswered,
                lastSubmitted: q.lastSubmitted,
              }
            }) ?? [],
        }
      } catch (error) {
        ELError = true
        this.logger.error('Failed to fetch EL questionnaires', error)
      }
    }

    let LSHquestionnaires: QuestionnairesList = { questionnaires: [] }

    if (useLSH) {
      try {
        const lshData: LSHQuestionnaireType[] | null =
          await this.lshApi.getQuestionnaires(user, locale ?? 'is')
        LSHquestionnaires = {
          questionnaires:
            (lshData ?? [])
              .filter((item: LSHQuestionnaireType) => item.gUID != null)
              .map((item: LSHQuestionnaireType) => {
                return {
                  id: item.gUID ?? 'undefined-id',
                  title: item.caption
                    ? item.caption
                    : formatMessage(m.questionnaireWithoutTitle),
                  description: item.description ?? undefined,
                  sentDate: item.validFromDateTime?.toISOString() ?? '',
                  organization: QuestionnairesOrganizationEnum.LSH,
                  department: item.department ?? undefined,
                  status: item.answerDateTime
                    ? QuestionnairesStatusEnum.answered
                    : new Date(item.validToDateTime) < new Date()
                    ? QuestionnairesStatusEnum.expired
                    : QuestionnairesStatusEnum.notAnswered,
                }
              }) || [],
        }
      } catch (error) {
        LSHerror = true
        this.logger.error('Failed to fetch LSH questionnaires', error)
      }
    }

    const allLists = [ELquestionnaires, LSHquestionnaires]

    // If both sources failed, throw an error
    if (ELError && LSHerror) {
      throw new Error(
        `Failed to fetch questionnaires from both sources: EL and LSH`,
      )
    }

    return {
      questionnaires:
        allLists
          .flatMap((list) => list.questionnaires)
          .filter((q) => q !== undefined)
          .sort((a, b) => {
            // First, sort by status (expired goes to bottom)
            const aIsExpired = a.status === QuestionnairesStatusEnum.expired
            const bIsExpired = b.status === QuestionnairesStatusEnum.expired

            if (aIsExpired && !bIsExpired) return 1
            if (!aIsExpired && bIsExpired) return -1

            // Then sort by date (newest first)
            const dateA = Date.parse(a.sentDate) || 0
            const dateB = Date.parse(b.sentDate) || 0

            return dateB - dateA
          }) ?? null,
    }
  }

  private async getELQuestionnaire(
    locale: Locale,
    withQuestions?: boolean,
    data?: QuestionnaireDetailDto | null,
  ): Promise<Questionnaire | null> {
    if (!data) return null
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )

    return withQuestions
      ? mapELQuestionnaire(data, formatMessage)
      : {
          baseInformation: {
            id: data.questionnaireId,
            title: data.title ?? formatMessage(m.questionnaireWithoutTitle),
            sentDate: data.lastSubmitted?.toDateString() ?? '',
            status: data.hasDraft
              ? QuestionnairesStatusEnum.draft
              : data.submissions?.length > 0
              ? QuestionnairesStatusEnum.answered
              : !data.canSubmit
              ? QuestionnairesStatusEnum.expired
              : QuestionnairesStatusEnum.notAnswered,
            description: data.message ?? undefined,
            organization: QuestionnairesOrganizationEnum.EL,
            lastSubmissionId: data.lastCreatedSubmissionId,
          },
          submissions: data.submissions?.map((sub) => ({
            id: sub.id,
            createdAt: sub.createdDate ?? undefined,
            isDraft: sub.isDraft,
            lastUpdated: sub.lastUpdatedDate ?? undefined,
          })),
          canSubmit: data.canSubmit,
          expirationDate: data.expiryDate ?? undefined,
        }
  }

  private async getLSHQuestionnaire(
    locale: Locale,
    data?: LSHQuestionnaireType | null | undefined,
  ): Promise<Questionnaire | null> {
    if (!data) return null
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE],
      locale,
    )

    return {
      baseInformation: {
        id: data.gUID ?? 'undefined-id',
        title: data.caption ?? formatMessage(m.questionnaireWithoutTitle),
        status: data.answerDateTime
          ? QuestionnairesStatusEnum.answered
          : new Date(data.validToDateTime) < new Date()
          ? QuestionnairesStatusEnum.expired
          : QuestionnairesStatusEnum.notAnswered,
        sentDate: data.validFromDateTime?.toISOString() ?? '',
        description: data.description ?? undefined,
        organization: QuestionnairesOrganizationEnum.LSH,
      },
      canSubmit: data.answerDateTime ? false : true,
    }
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
