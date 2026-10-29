import { Injectable } from '@nestjs/common'
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
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly selfAssessmentClient: FjarskiptastofaSelfAssessmentClientService,
  ) {
    super(ApplicationTypes.FJARSKIPTASTOFA_SELF_ASSESSMENT)
  }

  // Data provider: check whether the company is a supervised entity with an open
  // access window. The flags are stored in externalData so the prerequisites
  // screen can block the submit (and show the "not eligible" error) when the
  // company is not a supervised entity or its access window is closed.
  async getIsRegulated({ auth, application }: TemplateApiModuleActionProps) {
    const ssn = application.applicant

    const { isSupervisedEntity, accessWindowOpen } =
      await this.selfAssessmentClient.isRegulated(auth, ssn)

    return { isSupervisedEntity, accessWindowOpen }
  }

  // Data provider: fetch the categories and questions the applicant answers.
  // Returning them from the API means new categories/questions need no changes
  // in the application itself.
  async getQuestionsAndCategories({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    const [categoriesResponse, questionsResponse] = await Promise.all([
      this.selfAssessmentClient.getQuestionCategories(auth, currentUserLocale),
      this.selfAssessmentClient.getQuestions(auth, currentUserLocale),
    ])

    return {
      categories: categoriesResponse.categoryList,
      questions: questionsResponse.questionList,
    }
  }

  async submitSelfAssessment({
    application,
    auth,
    currentUserLocale,
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

    // The company the application belongs to is the submitter.
    const submitterSSN = application.applicant

    // Fjarskiptastofa requires the submission language (required field on the
    // submit endpoint); fall back to Icelandic if the locale is unavailable.
    const payload = {
      language: currentUserLocale ?? 'is',
      submitterSSN,
      assessmentResponses,
    }

    return this.selfAssessmentClient.submitAnswers(auth, payload)
  }
}
