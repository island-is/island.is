import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApplicationTypes } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  AnswerRequest,
  AnswerStatus,
  FjarskiptastofaSelfAssessmentClientService,
} from '@island.is/clients/fjarskiptastofa/self-assessment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { SharedTemplateApiService } from '../../../shared'

// Matches the answers object stored by the assessment field, keyed by `q<id>`.
type StoredAssessmentAnswers = Record<
  string,
  { answerValue?: string; remark?: string }
>

@Injectable()
export class FjarskiptastofaSelfAssessmentService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly selfAssessmentClient: FjarskiptastofaSelfAssessmentClientService,
  ) {
    super(ApplicationTypes.FJARSKIPTASTOFA_SELF_ASSESSMENT)
  }

  // Data provider: fetch the categories and questions the applicant answers.
  // Returning them from the API means new categories/questions need no changes
  // in the application itself.
  async getQuestionsAndCategories({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    console.log('Fetching questions and categories')
    const [categoriesResponse, questionsResponse] = await Promise.all([
      this.selfAssessmentClient.getQuestionCategories(auth),
      this.selfAssessmentClient.getQuestions(auth, currentUserLocale),
    ])

    console.log('Category', categoriesResponse)

    return {
      categories: categoriesResponse.categoryList,
      questions: questionsResponse.questionList,
    }
  }

  async submitSelfAssessment({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const storedAnswers =
      getValueViaPath<StoredAssessmentAnswers>(
        application.answers,
        'assessment',
      ) ?? {}

    const assessmentResponses: AnswerRequest[] = Object.entries(storedAnswers)
      .filter(([, answer]) => Boolean(answer?.answerValue))
      .map(([key, answer]) => ({
        questionId: Number(key.replace(/^q/, '')),
        answerValue: answer.answerValue as AnswerStatus,
        remark: answer.remark,
      }))

    // The individual acting on behalf of the company is the submitter.
    const submitterSSN = '0101010000'

    const payload = { submitterSSN, assessmentResponses }

    // DEBUG: confirm the submit action is reached and inspect the payload.
    this.logger.info('[self-assessment] submitSelfAssessment hit', {
      applicationId: application.id,
      submitterSSN,
      responseCount: assessmentResponses.length,
      payload,
    })

    try {
      const response = await this.selfAssessmentClient.submitAnswers(
        auth,
        payload,
      )

      // DEBUG: log the response returned by Fjarskiptastofa.
      this.logger.info('[self-assessment] submitSelfAssessment response', {
        applicationId: application.id,
        response,
      })

      return response
    } catch (error) {
      // DEBUG: surface the failure (status/body) from the Fjarskiptastofa call.
      this.logger.error('[self-assessment] submitSelfAssessment failed', {
        applicationId: application.id,
        message: error?.message,
        status: error?.status ?? error?.response?.status,
        body: error?.body ?? error?.response?.data,
      })
      throw error
    }
  }
}
