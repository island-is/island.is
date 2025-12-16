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
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
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

@Injectable()
export class QuestionnairesService {
  constructor(
    private readonly api: HealthDirectorateHealthService,
    private readonly lshApi: LshClientService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getQuestionnaire(
    _user: User,
    _locale: Locale,
    input: GetQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    try {
      // Fetch questionnaire from LSH
      if (input.organization === QuestionnairesOrganizationEnum.LSH) {
        if (input.includeQuestions) {
          // Fetch full questionnaire including sections and questions
          const lshQuestionnaireWithQuestions =
            await this.lshApi.getQuestionnaire(_user, _locale, input.id)

          if (!lshQuestionnaireWithQuestions) {
            return null
          }

          return mapLshQuestionnaire(lshQuestionnaireWithQuestions)
        }

        // Otherwise fetch the list and select the matching questionnaire header
        const lshQuestionnaires = await this.lshApi.getQuestionnaires(
          _user,
          _locale,
        )
        const lshQuestionnaire: LSHQuestionnaireType | null =
          lshQuestionnaires?.find((q) => q.gUID === input.id) || null

        return this.getLSHQuestionnaire(_locale, lshQuestionnaire)
      }
    } catch (e) {
      this.logger.warn('Error fetching LSH questionnaire', e)
    }

    try {
      if (input.organization === QuestionnairesOrganizationEnum.EL) {
        // Fetch questionnaire from EL (Health Directorate)
        const elData: QuestionnaireDetailDto | null =
          await this.api.getQuestionnaire(_user, _locale, input.id)

        return this.getELQuestionnaire(_locale, input.includeQuestions, elData)
      }
    } catch (e) {
      this.logger.warn('Error fetching EL questionnaire', e)
    }
    return null
  }

  async getAnsweredQuestionnaire(
    _user: User,
    _locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<AnsweredQuestionnaires | null> {
    const organization = this.normalizeOrganization(input.organization)

    if (!organization || !input.id) {
      return null
    }

    if (
      organization === QuestionnairesOrganizationEnum.EL &&
      input.submissionId
    ) {
      return this.getELAnsweredQuestionnaire(
        _user,
        _locale,
        input.id,
        input.submissionId,
      )
    }

    if (organization === QuestionnairesOrganizationEnum.LSH) {
      return this.getLSHAnsweredQuestionnaire(_user, _locale, input)
    }

    return null
  }

  // Build answered questionnaire response for EL (Health Directorate)
  private async getELAnsweredQuestionnaire(
    _user: User,
    _locale: Locale,
    questionnaireId: string,
    submissionId: string,
  ): Promise<AnsweredQuestionnaires | null> {
    try {
      const ELdata = await this.api.getQuestionnaireAnswered(
        _user,
        _locale,
        questionnaireId,
        submissionId,
      )

      if (!ELdata) {
        return null
      }

      const repliesMap = new Map(
        ELdata.replies?.map((reply) => [reply.questionId, reply]) || [],
      )

      const submission = {
        id: questionnaireId,
        title:
          ELdata.title || _locale === 'is' ? 'Spurningalisti' : 'Questionnaire',
        isDraft: ELdata.submission.isDraft || false,
        description: ELdata.message || undefined,
        date:
          this.formatDate(ELdata.submission?.submittedDate) ||
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
                      // StringReplyDto, NumberReplyDto, BooleanReplyDto, DateReplyDto
                      values = [String(reply.answer)]
                    }
                  }

                  return {
                    id: item.id || 'undefined-id',
                    label: item.label || '',
                    values,
                  }
                }) || [],
            )
            .filter((answer) => answer !== undefined) || [],
      }

      return { data: [submission] }
    } catch (error) {
      this.logger.warn('Error fetching EL answered questionnaire', error)
      return null
    }
  }

  // Build answered questionnaire response for LSH
  private async getLSHAnsweredQuestionnaire(
    _user: User,
    _locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<AnsweredQuestionnaires | null> {
    const LSHdata = await this.lshApi.getAnsweredQuestionnaire(
      _user,
      _locale,
      input.id,
    )

    const LSHquestionnaire = await this.lshApi.getQuestionnaire(
      _user,
      _locale,
      input.id,
    )

    if (!LSHdata || !LSHdata.answers) {
      return null
    }

    const data = {
      id: LSHdata.gUID || 'undefined-id',
      title:
        LSHquestionnaire?.header || _locale === 'is'
          ? 'Spurningalisti'
          : 'Questionnaire',
      description: LSHquestionnaire?.description || undefined,
      answers: LSHdata.answers?.map((answer) => {
        // Search through all sections to find the matching question
        const question = LSHquestionnaire?.sections
          ?.flatMap((section) => section.questions || [])
          .find((q) => q.entryID === answer.entryID)

        // Map values to their labels from the question options
        const valueLabels =
          answer.values?.map((value) => {
            const option = question?.options?.find((opt) => opt.value === value)
            return option?.label || value
          }) || []

        return {
          id: answer.entryID || 'undefined-id',
          label: question?.question || 'LABEL',
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
          success: response?.status === 'success' || true,
          message: response?.message || 'Questionnaire submitted successfully',
        }
      } catch (e) {
        this.logger.warn('Error submitting questionnaire to LSH', e)
        return {
          success: false,
          message: 'Error submitting questionnaire to LSH',
        }
      }
    }

    // Submit to EL (Health Directorate)
    if (organization === QuestionnairesOrganizationEnum.EL) {
      try {
        const elAnswer = mapToElAnswer(input)
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
        this.logger.warn('Error submitting questionnaire to EL', e)
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
    _user: User,
    _locale: Locale,
  ): Promise<QuestionnairesList | null> {
    let ELquestionnaires: QuestionnairesList = { questionnaires: [] }

    try {
      const data: QuestionnaireBaseDto[] | null =
        await this.api.getQuestionnaires(_user, _locale)
      ELquestionnaires = {
        questionnaires:
          (data ?? []).map((q) => {
            return {
              id: q.questionnaireId,
              title: this.getDefaultQuestionnaireTitle(_locale, q.title),
              description: q.message ?? undefined,
              sentDate: q.createdDate?.toDateString() || '',
              organization: QuestionnairesOrganizationEnum.EL,
              department: undefined,
              status:
                q.numSubmissions > 0 || q.lastSubmitted
                  ? QuestionnairesStatusEnum.answered
                  : q.hasDraft
                  ? QuestionnairesStatusEnum.draft
                  : QuestionnairesStatusEnum.notAnswered,
              lastSubmitted: q.lastSubmitted,
            }
          }) || [],
      }
    } catch (e) {
      this.logger.warn('EL questionnaires fetch failed', e)
    }

    let LSHquestionnaires: QuestionnairesList = { questionnaires: [] }

    try {
      const lshData: LSHQuestionnaireType[] | null =
        await this.lshApi.getQuestionnaires(_user, 'is')
      LSHquestionnaires = {
        questionnaires:
          (lshData ?? [])
            .filter((item: LSHQuestionnaireType) => item.gUID != null)
            .map((item: LSHQuestionnaireType) => {
              return {
                id: item.gUID || 'undefined-id',
                title: item.caption ? item.caption : 'Spurningalisti',
                description: item.description ?? undefined,
                sentDate: item.validFromDateTime.toISOString(),
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
    } catch (e) {
      this.logger.warn('LSH questionnaires fetch failed', e)
    }

    const allLists = [ELquestionnaires, LSHquestionnaires]

    return {
      questionnaires: allLists
        .flatMap((list) => list.questionnaires)
        .filter((q) => q !== undefined)
        .sort((a, b) => {
          // First, sort by status (expired goes to bottom)
          const aIsExpired = a.status === QuestionnairesStatusEnum.expired
          const bIsExpired = b.status === QuestionnairesStatusEnum.expired

          if (aIsExpired && !bIsExpired) return 1
          if (!aIsExpired && bIsExpired) return -1

          // Then sort by date (newest first)
          const dateA = new Date(a.sentDate).getTime()
          const dateB = new Date(b.sentDate).getTime()

          return dateB - dateA
        }),
    }
  }

  private getELQuestionnaire(
    _locale: Locale,
    withQuestions?: boolean,
    data?: QuestionnaireDetailDto | null,
  ): Questionnaire | null {
    if (!data) return null
    return withQuestions
      ? mapELQuestionnaire(data, _locale)
      : {
          baseInformation: {
            id: data.questionnaireId,
            title: this.getDefaultQuestionnaireTitle(_locale, data.title),
            sentDate: data.lastSubmitted?.toDateString() || '',
            status: data.hasDraft
              ? QuestionnairesStatusEnum.draft
              : data.submissions?.length > 0
              ? QuestionnairesStatusEnum.answered
              : !data.canSubmit
              ? QuestionnairesStatusEnum.expired
              : QuestionnairesStatusEnum.notAnswered,
            description: data.message || undefined,
            organization: QuestionnairesOrganizationEnum.EL,
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

  private getLSHQuestionnaire(
    _locale: Locale,
    data?: LSHQuestionnaireType | null | undefined,
  ): Questionnaire | null {
    if (!data) return null
    return {
      baseInformation: {
        id: data.gUID || 'undefined-id',
        title: this.getDefaultQuestionnaireTitle(_locale, data.caption),
        status: data.answerDateTime
          ? QuestionnairesStatusEnum.answered
          : new Date(data.validToDateTime) < new Date()
          ? QuestionnairesStatusEnum.expired
          : QuestionnairesStatusEnum.notAnswered,
        sentDate: data.validFromDateTime?.toISOString() || '',
        description: data.description || undefined,
        organization: QuestionnairesOrganizationEnum.LSH,
      },
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

  private getDefaultQuestionnaireTitle(
    locale: Locale,
    preferredTitle?: string | null,
  ): string {
    if (preferredTitle) {
      return preferredTitle
    }

    return locale === 'is'
      ? 'Ónefndur spurningalisti'
      : 'Untitled questionnaire'
  }
}
