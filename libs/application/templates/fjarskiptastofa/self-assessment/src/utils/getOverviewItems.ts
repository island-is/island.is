import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
  StaticText,
} from '@island.is/application/types'
import { AssessmentAnswer } from './constants'
import {
  getAssessmentAnswers,
  getQuestionsData,
  groupQuestionsByCategory,
} from './assessment'
import { m } from '../lib/messages'

const answerLabel = (value?: string): StaticText => {
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

export const getOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const companyName =
    getValueViaPath<string>(externalData, 'identity.data.name') ?? ''

  const items: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: m.companyInfo.companyName,
      valueText: companyName,
    },
  ]

  // Categories and questions come from the API, so the overview is built from the
  // same data the applicant answered rather than a hardcoded list.
  const questionsData = getQuestionsData(externalData)
  const assessmentAnswers = getAssessmentAnswers(answers)

  if (questionsData) {
    for (const { category, questions } of groupQuestionsByCategory(
      questionsData,
    )) {
      if (questions.length === 0) continue

      items.push({ width: 'full', keyText: category.label, valueText: '' })

      for (const question of questions) {
        const answer = assessmentAnswers?.[`q${question.id}`]
        items.push({
          width: 'half',
          keyText: question.questionText,
          valueText: answerLabel(answer?.answerValue),
        })
      }
    }
  }

  return items
}
