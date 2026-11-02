import { ExternalData, FormValue } from '@island.is/application/types'
import { getOverviewItems } from './getOverviewItems'
import {
  ASSESSMENT_ANSWERS_ID,
  AssessmentAnswer,
  QUESTIONS_EXTERNAL_DATA_ID,
} from './constants'
import { m } from '../lib/messages'
import { AssessmentQuestionsData } from './types'

const questionsData: AssessmentQuestionsData = {
  categories: [
    { id: 1, label: 'Governance', shortLabel: 'Gov' },
    { id: 2, label: 'Empty category', shortLabel: 'Empty' },
  ],
  questions: [
    { id: 10, categoryId: 1, questionText: 'Q10', tooltip: '' },
    { id: 11, categoryId: 1, questionText: 'Q11', tooltip: '' },
  ],
}

const externalDataWith = (data: object): ExternalData => ({
  identity: {
    data: { name: 'Acme ehf.' },
    date: new Date(),
    status: 'success',
  },
  [QUESTIONS_EXTERNAL_DATA_ID]: {
    data,
    date: new Date(),
    status: 'success',
  },
})

describe('getOverviewItems', () => {
  it('should always start with the company name', () => {
    const items = getOverviewItems({}, externalDataWith(questionsData))
    expect(items[0]).toEqual({
      width: 'half',
      keyText: m.companyInfo.companyName,
      valueText: 'Acme ehf.',
    })
  })

  it('should use an empty company name when identity is missing', () => {
    const items = getOverviewItems({}, {})
    expect(items[0].valueText).toBe('')
  })

  it('should list only the company name when there is no questions data', () => {
    const items = getOverviewItems(
      {},
      {
        identity: {
          data: { name: 'Acme ehf.' },
          date: new Date(),
          status: 'success',
        },
      },
    )
    expect(items).toHaveLength(1)
  })

  it('should render a category header followed by its answered questions', () => {
    const answers: FormValue = {
      [ASSESSMENT_ANSWERS_ID]: {
        q10: { answerValue: AssessmentAnswer.YES, remark: 'ok' },
        q11: { answerValue: AssessmentAnswer.NO, remark: 'no' },
      },
    }

    const items = getOverviewItems(answers, externalDataWith(questionsData))

    // company name + category header + two questions
    expect(items).toHaveLength(4)
    expect(items[1]).toEqual({
      width: 'full',
      keyText: 'Governance',
      valueText: '',
    })
    expect(items[2]).toEqual({
      width: 'half',
      keyText: 'Q10',
      valueText: m.shared.answerYes,
    })
    expect(items[3]).toEqual({
      width: 'half',
      keyText: 'Q11',
      valueText: m.shared.answerNo,
    })
  })

  it('should skip categories that have no questions', () => {
    const items = getOverviewItems({}, externalDataWith(questionsData))
    expect(items.some((item) => item.keyText === 'Empty category')).toBe(false)
  })

  it('should show an empty label for an unanswered question', () => {
    const items = getOverviewItems({}, externalDataWith(questionsData))
    const q10 = items.find((item) => item.keyText === 'Q10')
    expect(q10?.valueText).toBe('')
  })
})
