import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import {
  getAnswerLabel,
  getAssessmentAnswers,
  getQuestionsData,
  groupQuestionsByCategory,
} from './assessment'
import { m } from '../lib/messages'

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
          valueText: getAnswerLabel(answer?.answerValue),
        })
      }
    }
  }

  return items
}
