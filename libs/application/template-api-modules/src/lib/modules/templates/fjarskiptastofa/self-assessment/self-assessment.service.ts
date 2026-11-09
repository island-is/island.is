import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationTypes, StaticText } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { m } from '@island.is/application/templates/fjarskiptastofa/self-assessment'
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

// The questions the applicant was shown, as stored in externalData by the
// questions data provider.
type StoredQuestions = { id: number }[]

@Injectable()
export class FjarskiptastofaSelfAssessmentService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly selfAssessmentClient: FjarskiptastofaSelfAssessmentClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.FJARSKIPTASTOFA_SELF_ASSESSMENT)
  }

  // Data provider: check whether the company is a supervised entity with an open
  // access window. The flags are stored in externalData so the prerequisites
  // screen can block the submit (and show the "not eligible" error) when the
  // company is not a supervised entity or its access window is closed.
  async getIsRegulated({ auth, application }: TemplateApiModuleActionProps) {
    const ssn = application.applicant

    const { isSupervisedEntity, accessWindowOpen } = await this.callUpstream(
      'getIsRegulated',
      () => this.selfAssessmentClient.isRegulated(auth, ssn),
      m.apiErrors.isRegulatedTitle,
      m.apiErrors.isRegulatedSummary,
    )

    return { isSupervisedEntity, accessWindowOpen }
  }

  // Data provider: fetch the categories and questions the applicant answers.
  // Returning them from the API means new categories/questions need no changes
  // in the application itself.
  async getQuestionsAndCategories({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    const [categoriesResponse, questionsResponse] = await this.callUpstream(
      'getQuestionsAndCategories',
      () =>
        Promise.all([
          this.selfAssessmentClient.getQuestionCategories(
            auth,
            currentUserLocale,
          ),
          this.selfAssessmentClient.getQuestions(auth, currentUserLocale),
        ]),
      m.apiErrors.questionsTitle,
      m.apiErrors.questionsSummary,
    )

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

    // Build the payload from the questions the applicant was shown rather than
    // from the stored answers, so a missing answer is caught instead of being
    // silently left out of the submission.
    const questions =
      getValueViaPath<StoredQuestions>(
        application.externalData,
        'selfAssessmentQuestions.data.questions',
      ) ?? []

    if (questions.length === 0) {
      throw new TemplateApiError(
        {
          title: m.overview.errorTitle,
          summary: m.assessment.loadError,
        },
        400,
      )
    }

    // Fjarskiptastofa only accepts a complete self-assessment: every question
    // needs both an answer and a remark. The form blocks an incomplete submit,
    // so this is the guard for a submit that gets past it - a partial
    // assessment must not reach Fjarskiptastofa as a finished one.
    const assessmentResponses: AnswerRequest[] = questions.map(({ id }) => {
      const answer = storedAnswers[`q${id}`]

      if (!answer?.answerValue || !answer.remark?.trim()) {
        throw new TemplateApiError(
          {
            title: m.overview.errorTitle,
            summary: m.assessment.requiredError,
          },
          400,
        )
      }

      return {
        questionId: id,
        answerValue: answer.answerValue as AnswerStatus,
        remark: answer.remark,
      }
    })

    // The company the application belongs to is the submitter.
    const submitterSSN = application.applicant

    // Fjarskiptastofa requires the submission language (required field on the
    // submit endpoint); fall back to Icelandic if the locale is unavailable.
    const payload = {
      language: currentUserLocale ?? 'is',
      submitterSSN,
      assessmentResponses,
    }

    return this.callUpstream(
      'submitSelfAssessment',
      () => this.selfAssessmentClient.submitAnswers(auth, payload),
      m.apiErrors.submitTitle,
      m.apiErrors.submitSummary,
    )
  }

  /**
   * Runs a request to Fjarskiptastofa and replaces any failure with a
   * TemplateApiError carrying only our own message.
   *
   * Nothing from the upstream error is passed on. A FetchError keeps the parsed
   * `application/problem+json` body on `error.problem`, and because that
   * property makes TemplateAPIService.handleError treat it as a TemplateApiError
   * it would be logged verbatim (`{ ...error }`) for any status >= 500 and shown
   * to the applicant. Fjarskiptastofa's problem bodies can quote the submitted
   * answers and remarks, which is exactly the data this application must keep
   * out of the logs - the same reason the client's logger is wrapped in
   * redactProblemBody.
   *
   * The failure is logged by shape only (which call, what kind of error, and
   * the HTTP status when there is one) so a problem is still traceable. Enhanced
   * fetch already logs HTTP failures with the problem field redacted; what it
   * does not cover is everything else, such as a malformed response or a parse
   * error, which would otherwise disappear without a trace. `problem`, `body`
   * and the request payload are never logged.
   */
  private async callUpstream<T>(
    action: string,
    request: () => Promise<T>,
    title: StaticText,
    summary: StaticText,
  ): Promise<T> {
    try {
      return await request()
    } catch (error) {
      this.logger.warn('Fjarskiptastofa self-assessment request failed', {
        action,
        errorName: error instanceof Error ? error.name : typeof error,
        // Present on a FetchError; absent for a non-HTTP failure.
        status: getErrorStatus(error),
      })

      throw new TemplateApiError({ title, summary }, 500)
    }
  }
}

// Reads the HTTP status off a FetchError without widening the error type, so a
// non-HTTP failure simply has no status rather than leaking other fields.
const getErrorStatus = (error: unknown): number | undefined => {
  const status = (error as { status?: unknown } | null)?.status
  return typeof status === 'number' ? status : undefined
}
