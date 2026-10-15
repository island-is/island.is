import { ExternalData, FormValue } from '@island.is/application/types'
import {
  answerFieldId,
  answerKey,
  getAllQuestions,
  getAnswerLabel,
  getAssessmentAnswers,
  getQuestionsData,
  getReferenceNumber,
  getSelfAssessmentResult,
  groupQuestionsByCategory,
  isQuestionAnswered,
  parseQuestionId,
  PLACEHOLDER_REFERENCE_NUMBER,
} from './assessment'
import {
  ASSESSMENT_ANSWERS_ID,
  AssessmentAnswer,
  QUESTIONS_EXTERNAL_DATA_ID,
  SUBMIT_EXTERNAL_DATA_ID,
} from './constants'
import { m } from '../lib/messages'
import { AssessmentQuestionsData, SelfAssessmentResult } from './types'

const questionsData: AssessmentQuestionsData = {
  categories: [
    { id: 1, label: 'Governance', shortLabel: 'Gov' },
    { id: 2, label: 'Risk', shortLabel: 'Risk' },
  ],
  questions: [
    { id: 10, categoryId: 1, questionText: 'Q10', tooltip: '' },
    { id: 11, categoryId: 1, questionText: 'Q11', tooltip: '' },
    { id: 20, categoryId: 2, questionText: 'Q20', tooltip: '' },
  ],
}

describe('assessment utils', () => {
  describe('answerKey', () => {
    it('should prefix the numeric question id to keep answers keyed as an object', () => {
      expect(answerKey(42)).toBe('q42')
    })
  })

  describe('parseQuestionId', () => {
    it('should strip the prefix and return the numeric id', () => {
      expect(parseQuestionId('q42')).toBe(42)
    })

    it('should round-trip with answerKey', () => {
      expect(parseQuestionId(answerKey(7))).toBe(7)
    })
  })

  describe('answerFieldId', () => {
    it('should build the path to a stored answer field', () => {
      expect(answerFieldId(5, 'answerValue')).toBe(
        `${ASSESSMENT_ANSWERS_ID}.q5.answerValue`,
      )
      expect(answerFieldId(5, 'remark')).toBe(
        `${ASSESSMENT_ANSWERS_ID}.q5.remark`,
      )
    })
  })

  describe('getQuestionsData', () => {
    it('should read the questions data from external data', () => {
      const externalData: ExternalData = {
        [QUESTIONS_EXTERNAL_DATA_ID]: {
          data: questionsData,
          date: new Date(),
          status: 'success',
        },
      }
      expect(getQuestionsData(externalData)).toEqual(questionsData)
    })

    it('should return undefined when the questions data is missing', () => {
      expect(getQuestionsData({})).toBeUndefined()
    })
  })

  describe('getSelfAssessmentResult', () => {
    it('should read the submit result from external data', () => {
      const result: SelfAssessmentResult = {
        averageOverallScore: 3,
        categoryScores: [{ categoryId: 1, score: 3 }],
        referenceNumber: '42',
      }
      const externalData: ExternalData = {
        [SUBMIT_EXTERNAL_DATA_ID]: {
          data: result,
          date: new Date(),
          status: 'success',
        },
      }
      expect(getSelfAssessmentResult(externalData)).toEqual(result)
    })

    it('should return undefined when the result is missing', () => {
      expect(getSelfAssessmentResult({})).toBeUndefined()
    })
  })

  describe('getReferenceNumber', () => {
    it('should return the reference number from the result', () => {
      expect(
        getReferenceNumber({
          averageOverallScore: 0,
          categoryScores: [],
          referenceNumber: '999',
        }),
      ).toBe('999')
    })

    it('should fall back to the placeholder when there is no result', () => {
      expect(getReferenceNumber(undefined)).toBe(PLACEHOLDER_REFERENCE_NUMBER)
    })

    it('should fall back to the placeholder when the result has no reference number', () => {
      expect(
        getReferenceNumber({ averageOverallScore: 0, categoryScores: [] }),
      ).toBe(PLACEHOLDER_REFERENCE_NUMBER)
    })
  })

  describe('getAssessmentAnswers', () => {
    it('should read the answers record from the form value', () => {
      const answers: FormValue = {
        [ASSESSMENT_ANSWERS_ID]: {
          q10: { answerValue: AssessmentAnswer.YES, remark: 'ok' },
        },
      }
      expect(getAssessmentAnswers(answers)).toEqual({
        q10: { answerValue: AssessmentAnswer.YES, remark: 'ok' },
      })
    })

    it('should return an empty object when there are no answers', () => {
      expect(getAssessmentAnswers({})).toEqual({})
    })
  })

  describe('groupQuestionsByCategory', () => {
    it('should group questions under their category preserving order', () => {
      const grouped = groupQuestionsByCategory(questionsData)
      expect(grouped).toHaveLength(2)
      expect(grouped[0].category.id).toBe(1)
      expect(grouped[0].questions.map((q) => q.id)).toEqual([10, 11])
      expect(grouped[1].category.id).toBe(2)
      expect(grouped[1].questions.map((q) => q.id)).toEqual([20])
    })

    it('should return an empty question list for a category with no questions', () => {
      const grouped = groupQuestionsByCategory({
        categories: [{ id: 3, label: 'Empty', shortLabel: 'E' }],
        questions: [],
      })
      expect(grouped[0].questions).toEqual([])
    })
  })

  describe('getAllQuestions', () => {
    it('should return all questions', () => {
      expect(getAllQuestions(questionsData)).toHaveLength(3)
    })

    it('should return an empty array when there is no data', () => {
      expect(getAllQuestions(undefined)).toEqual([])
    })
  })

  describe('isQuestionAnswered', () => {
    it('should return true only when both the answer and a non-blank remark are set', () => {
      expect(
        isQuestionAnswered({
          answerValue: AssessmentAnswer.YES,
          remark: 'done',
        }),
      ).toBe(true)
    })

    it('should return false when the remark is missing or blank', () => {
      expect(isQuestionAnswered({ answerValue: AssessmentAnswer.YES })).toBe(
        false,
      )
      expect(
        isQuestionAnswered({
          answerValue: AssessmentAnswer.YES,
          remark: '   ',
        }),
      ).toBe(false)
    })

    it('should return false when the answer value is missing', () => {
      expect(
        isQuestionAnswered({
          answerValue: undefined as unknown as AssessmentAnswer,
          remark: 'remark',
        }),
      ).toBe(false)
      expect(isQuestionAnswered(undefined)).toBe(false)
    })
  })

  describe('getAnswerLabel', () => {
    it('should map each answer value to its label message', () => {
      expect(getAnswerLabel(AssessmentAnswer.YES)).toBe(m.shared.answerYes)
      expect(getAnswerLabel(AssessmentAnswer.IN_ADOPTION)).toBe(
        m.shared.answerInAdoption,
      )
      expect(getAnswerLabel(AssessmentAnswer.IN_PROGRESS)).toBe(
        m.shared.answerInProgress,
      )
      expect(getAnswerLabel(AssessmentAnswer.NO)).toBe(m.shared.answerNo)
    })

    it('should return an empty string for an unknown or missing value', () => {
      expect(getAnswerLabel(undefined)).toBe('')
      expect(getAnswerLabel('something-else')).toBe('')
    })
  })
})
