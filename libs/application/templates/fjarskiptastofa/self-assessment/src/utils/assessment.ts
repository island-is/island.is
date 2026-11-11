import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  StaticText,
} from '@island.is/application/types'
import {
  ASSESSMENT_ANSWERS_ID,
  AssessmentAnswer,
  QUESTIONS_EXTERNAL_DATA_ID,
  SUBMIT_EXTERNAL_DATA_ID,
  UNCATEGORISED_CATEGORY_ID,
} from './constants'
import { m } from '../lib/messages'
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

export const answerFieldId = (
  questionId: number,
  field: 'answerValue' | 'remark',
) => `${ASSESSMENT_ANSWERS_ID}.${answerKey(questionId)}.${field}`

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

// The reference number (tilvísunarnúmer) flows from the submit result. The
// submit API does not return a user-facing reference yet, so the screen and the
// PDF leave the field out entirely rather than show a made-up number.
export const getReferenceNumber = (
  result: SelfAssessmentResult | undefined,
): string | undefined => result?.referenceNumber

export const getAssessmentAnswers = (answers: FormValue): AssessmentAnswers =>
  getValueViaPath<AssessmentAnswers>(answers, ASSESSMENT_ANSWERS_ID) ?? {}

// Questions grouped under their category, preserving the API's category order.
//
// Fjarskiptastofa's contract is that every question's categoryId refers to a
// category in categoryList, but a question whose category is missing is still
// grouped - under a fallback heading - rather than dropped. The overview
// requires an answer for every question in externalData and the submit api
// rejects an incomplete assessment, so a dropped question would be one the
// applicant can never answer and never see listed as missing, leaving the
// application stuck. Grouping the orphans keeps the set that is rendered and
// the set that is required identical.
export const groupQuestionsByCategory = (
  data: AssessmentQuestionsData,
  uncategorisedLabel: string,
) => {
  const groups = data.categories.map((category) => ({
    category,
    questions: data.questions.filter((q) => q.categoryId === category.id),
  }))

  const knownCategoryIds = new Set(data.categories.map(({ id }) => id))
  const uncategorised = data.questions.filter(
    (q) => !knownCategoryIds.has(q.categoryId),
  )

  if (uncategorised.length === 0) {
    return groups
  }

  return [
    ...groups,
    {
      category: {
        id: UNCATEGORISED_CATEGORY_ID,
        label: uncategorisedLabel,
        shortLabel: uncategorisedLabel,
      },
      questions: uncategorised,
    },
  ]
}

export const getAllQuestions = (
  data: AssessmentQuestionsData | undefined,
): AssessmentQuestion[] => data?.questions ?? []

// A question only counts as answered when both the answer and the remark are
// filled in, so an applicant cannot leave a required explanation blank.
export const isQuestionAnswered = (
  answer: AssessmentAnswerValue | undefined,
): boolean => Boolean(answer?.answerValue && answer.remark?.trim())

// Maps a stored answer value to its human-readable label message, shared by the
// overview and the downloadable results PDF so both read from one source.
export const getAnswerLabel = (value?: string): StaticText => {
  switch (value) {
    case AssessmentAnswer.YES:
      return m.shared.answerYes
    case AssessmentAnswer.IN_ADOPTION:
      return m.shared.answerInAdoption
    case AssessmentAnswer.IN_PROGRESS:
      return m.shared.answerInProgress
    case AssessmentAnswer.NO:
      return m.shared.answerNo
    default:
      return ''
  }
}
