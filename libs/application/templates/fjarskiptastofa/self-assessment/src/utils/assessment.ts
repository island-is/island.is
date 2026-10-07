import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  ASSESSMENT_ANSWERS_ID,
  QUESTIONS_EXTERNAL_DATA_ID,
  SUBMIT_EXTERNAL_DATA_ID,
} from './constants'
import {
  AssessmentAnswers,
  AssessmentAnswerValue,
  AssessmentQuestion,
  AssessmentQuestionsData,
  SelfAssessmentResult,
} from './types'

// react-hook-form treats a purely numeric path segment as an array index, which
// would turn the answers object into a huge sparse array. Prefixing the question
// id keeps it an object keyed by string.
export const answerKey = (questionId: number) => `q${questionId}`

export const answerFieldId = (questionId: number, field: 'answerValue' | 'remark') =>
  `${ASSESSMENT_ANSWERS_ID}.${answerKey(questionId)}.${field}`

export const parseQuestionId = (key: string): number =>
  Number(key.replace(/^q/, ''))

export const getQuestionsData = (
  externalData: ExternalData,
): AssessmentQuestionsData | undefined =>
  getValueViaPath<AssessmentQuestionsData>(
    externalData,
    `${QUESTIONS_EXTERNAL_DATA_ID}.data`,
  )

// The preliminary scoring the submit API returns, stored in externalData when
// the application exits the draft state.
export const getSelfAssessmentResult = (
  externalData: ExternalData,
): SelfAssessmentResult | undefined =>
  getValueViaPath<SelfAssessmentResult>(
    externalData,
    `${SUBMIT_EXTERNAL_DATA_ID}.data`,
  )

export const getAssessmentAnswers = (answers: FormValue): AssessmentAnswers =>
  getValueViaPath<AssessmentAnswers>(answers, ASSESSMENT_ANSWERS_ID) ?? {}

// Questions grouped under their category, preserving the API's category order.
export const groupQuestionsByCategory = (data: AssessmentQuestionsData) =>
  data.categories.map((category) => ({
    category,
    questions: data.questions.filter((q) => q.categoryId === category.id),
  }))

export const getAllQuestions = (
  data: AssessmentQuestionsData | undefined,
): AssessmentQuestion[] => data?.questions ?? []

// A question only counts as answered when both the answer and the remark are
// filled in, so an applicant cannot leave a required explanation blank.
export const isQuestionAnswered = (
  answer: AssessmentAnswerValue | undefined,
): boolean => Boolean(answer?.answerValue && answer.remark?.trim())
