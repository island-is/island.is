/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionnaireVisibilityOperator } from '@island.is/api/schema'
import '@testing-library/jest-dom'
import { QuestionAnswer } from '../../../types/questionnaire'
import {
  evaluateExpression,
  evaluateStructuredVisibilityConditions,
  extractDependenciesFromStructuredConditions,
  isQuestionVisibleWithStructuredConditions,
  isSectionVisible,
} from './visibilityUtils'

// Helper to create test answers
const createAnswer = (
  questionId: string,
  values: string[],
  labels?: string[],
): QuestionAnswer => ({
  questionId,
  answers: values.map((value, index) => ({
    value,
    label: labels?.[index],
  })),
  type: 'radio' as any,
  question: '',
})

describe('visibilityUtils', () => {
  describe('evaluateStructuredVisibilityConditions', () => {
    it('should return true when no conditions are provided', () => {
      const answers = {}
      expect(evaluateStructuredVisibilityConditions(undefined, answers)).toBe(
        true,
      )
      expect(evaluateStructuredVisibilityConditions([], answers)).toBe(true)
    })

    it('should return true when all conditions are met (AND logic)', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
        Q2: createAnswer('Q2', ['30']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
        {
          questionId: 'Q2',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['30'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should return false when any condition is not met (AND logic)', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
        Q2: createAnswer('Q2', ['25']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
        {
          questionId: 'Q2',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['30'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })
  })

  describe('equals operator', () => {
    it('should show question when answer equals expected value', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should hide question when answer does not equal expected value', () => {
      const answers = {
        Q1: createAnswer('Q1', ['no']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })

    it('should handle multiple expected values (OR within condition)', () => {
      const answers = {
        Q1: createAnswer('Q1', ['maybe']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes', 'maybe'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should respect showWhenMatched: false (inverted logic)', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: false, // Show when NOT matched
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })
  })

  describe('contains operator', () => {
    it('should show question when answer contains expected value', () => {
      const answers = {
        Q1: createAnswer('Q1', ['option1', 'option2']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.contains,
          expectedValues: ['option1'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should hide question when answer does not contain expected value', () => {
      const answers = {
        Q1: createAnswer('Q1', ['option1', 'option2']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.contains,
          expectedValues: ['option3'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })
  })

  describe('exists operator', () => {
    it('should show question when referenced question has an answer', () => {
      const answers = {
        Q1: createAnswer('Q1', ['some value']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.exists,
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should hide question when referenced question has no answer', () => {
      const answers = {}

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.exists,
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })

    it('should hide question when referenced question has empty string answer', () => {
      const answers = {
        Q1: createAnswer('Q1', ['']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.exists,
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })

    it('should hide question when referenced question has whitespace-only answer', () => {
      const answers = {
        Q1: createAnswer('Q1', ['   ']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.exists,
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })
  })

  describe('isEmpty operator', () => {
    it('should show question when referenced question has no answer', () => {
      const answers = {}

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.isEmpty,
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should hide question when referenced question has an answer', () => {
      const answers = {
        Q1: createAnswer('Q1', ['some value']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.isEmpty,
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })
  })

  describe('mathematical operators', () => {
    describe('greaterThan', () => {
      it('should show question when answer is greater than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['30']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'greaterThan' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(true)
      })

      it('should hide question when answer equals expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['18']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'greaterThan' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(false)
      })

      it('should hide question when answer is less than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['10']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'greaterThan' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(false)
      })
    })

    describe('greaterThanOrEqual', () => {
      it('should show question when answer is greater than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['30']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'greaterThanOrEqual' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(true)
      })

      it('should show question when answer equals expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['18']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'greaterThanOrEqual' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(true)
      })

      it('should hide question when answer is less than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['10']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'greaterThanOrEqual' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(false)
      })
    })

    describe('lessThan', () => {
      it('should show question when answer is less than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['10']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'lessThan' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(true)
      })

      it('should hide question when answer equals expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['18']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'lessThan' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(false)
      })

      it('should hide question when answer is greater than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['30']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'lessThan' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(false)
      })
    })

    describe('lessThanOrEqual', () => {
      it('should show question when answer is less than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['10']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'lessThanOrEqual' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(true)
      })

      it('should show question when answer equals expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['18']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'lessThanOrEqual' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(true)
      })

      it('should hide question when answer is greater than expected value', () => {
        const answers = {
          Q1: createAnswer('Q1', ['30']),
        }

        const conditions = [
          {
            questionId: 'Q1',
            operator: 'lessThanOrEqual' as any,
            expectedValues: ['18'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(conditions, answers),
        ).toBe(false)
      })
    })

    it('should handle decimal numbers in comparisons', () => {
      const answers = {
        Q1: createAnswer('Q1', ['18.5']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: 'greaterThan' as any,
          expectedValues: ['18.2'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should return false when answer is not a valid number', () => {
      const answers = {
        Q1: createAnswer('Q1', ['not a number']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: 'greaterThan' as any,
          expectedValues: ['18'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })
  })

  describe('complex scenarios', () => {
    it('should handle multiple conditions with different operators', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
        Q2: createAnswer('Q2', ['30']),
        Q3: createAnswer('Q3', ['option1', 'option2']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
        {
          questionId: 'Q2',
          operator: 'greaterThanOrEqual' as any,
          expectedValues: ['18'],
          showWhenMatched: true,
        },
        {
          questionId: 'Q3',
          operator: QuestionnaireVisibilityOperator.contains,
          expectedValues: ['option1'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )
    })

    it('should handle chained dependencies (Q3 depends on Q2, Q2 depends on Q1)', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
        Q2: createAnswer('Q2', ['married']),
      }

      // Q2 visibility: show if Q1 = yes
      const q2Conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
      ]

      // Q3 visibility: show if Q2 = married
      const q3Conditions = [
        {
          questionId: 'Q2',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['married'],
          showWhenMatched: true,
        },
      ]

      expect(
        evaluateStructuredVisibilityConditions(q2Conditions, answers),
      ).toBe(true)
      expect(
        evaluateStructuredVisibilityConditions(q3Conditions, answers),
      ).toBe(true)

      // If Q1 changes to 'no', Q2 should be hidden (and therefore Q3 as well)
      const updatedAnswers = {
        Q1: createAnswer('Q1', ['no']),
        Q2: createAnswer('Q2', ['married']),
      }

      expect(
        evaluateStructuredVisibilityConditions(q2Conditions, updatedAnswers),
      ).toBe(false)
    })

    it('should handle empty answer sets gracefully', () => {
      const answers = {}

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
      ]

      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        false,
      )
    })
    it('should handle answer clearing when question becomes hidden', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
        Q2: createAnswer('Q2', ['some answer']), // This should be cleared when Q1 changes
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
      ]

      // Initially visible
      expect(evaluateStructuredVisibilityConditions(conditions, answers)).toBe(
        true,
      )

      // When Q1 changes, Q2 should be hidden
      const updatedAnswers = {
        ...answers,
        Q1: createAnswer('Q1', ['no']),
      }

      expect(
        evaluateStructuredVisibilityConditions(conditions, updatedAnswers),
      ).toBe(false)
    })

    describe('real-world questionnaire flows', () => {
      it('should handle medical questionnaire: symptoms -> detailed questions', () => {
        const answers = {
          hasSymptoms: createAnswer('hasSymptoms', ['yes']),
          symptomType: createAnswer('symptomType', ['fever']),
          feverDuration: createAnswer('feverDuration', ['3']),
        }

        // Q: "Do you have symptoms?"
        // - If yes, show "What symptoms?" (symptomType)
        const symptomTypeConditions = [
          {
            questionId: 'hasSymptoms',
            operator: QuestionnaireVisibilityOperator.equals,
            expectedValues: ['yes'],
            showWhenMatched: true,
          },
        ]

        // Q: "How long have you had fever?"
        // - Only show if hasSymptoms=yes AND symptomType contains 'fever'
        const feverDurationConditions = [
          {
            questionId: 'hasSymptoms',
            operator: QuestionnaireVisibilityOperator.equals,
            expectedValues: ['yes'],
            showWhenMatched: true,
          },
          {
            questionId: 'symptomType',
            operator: QuestionnaireVisibilityOperator.contains,
            expectedValues: ['fever'],
            showWhenMatched: true,
          },
        ]

        expect(
          evaluateStructuredVisibilityConditions(
            symptomTypeConditions,
            answers,
          ),
        ).toBe(true)
        expect(
          evaluateStructuredVisibilityConditions(
            feverDurationConditions,
            answers,
          ),
        ).toBe(true)
      })
    })
  })

  describe('extractDependenciesFromStructuredConditions', () => {
    it('should extract unique question IDs from conditions', () => {
      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
        {
          questionId: 'Q2',
          operator: QuestionnaireVisibilityOperator.exists,
          showWhenMatched: true,
        },
        {
          questionId: 'Q1', // Duplicate
          operator: 'greaterThan' as any,
          expectedValues: ['5'],
          showWhenMatched: true,
        },
      ]

      const dependencies =
        extractDependenciesFromStructuredConditions(conditions)
      expect(dependencies).toHaveLength(2)
      expect(dependencies).toContain('Q1')
      expect(dependencies).toContain('Q2')
    })

    it('should return empty array when no conditions', () => {
      expect(extractDependenciesFromStructuredConditions(undefined)).toEqual([])
      expect(extractDependenciesFromStructuredConditions([])).toEqual([])
    })
  })

  describe('isQuestionVisibleWithStructuredConditions', () => {
    it('should be visible when no conditions are provided', () => {
      const answers = {}
      expect(
        isQuestionVisibleWithStructuredConditions(undefined, answers),
      ).toBe(true)
    })

    it('should respect visibility conditions', () => {
      const answers = {
        Q1: createAnswer('Q1', ['yes']),
      }

      const conditions = [
        {
          questionId: 'Q1',
          operator: QuestionnaireVisibilityOperator.equals,
          expectedValues: ['yes'],
          showWhenMatched: true,
        },
      ]

      expect(
        isQuestionVisibleWithStructuredConditions(conditions, answers),
      ).toBe(true)
    })
  })

  describe('isSectionVisible', () => {
    it('should be visible when no visibility conditions', () => {
      const section = {}
      const answers = {}

      expect(isSectionVisible(section, answers)).toBe(true)
    })

    it('should be visible when empty visibility conditions array', () => {
      const section = {
        visibilityConditions: [],
      }
      const answers = {}

      expect(isSectionVisible(section, answers)).toBe(true)
    })

    it('should respect visibility conditions', () => {
      const section = {
        visibilityConditions: [
          {
            questionId: 'Q1',
            operator: QuestionnaireVisibilityOperator.equals,
            expectedValues: ['yes'],
            showWhenMatched: true,
          },
        ],
      }

      const answersWithYes = {
        Q1: createAnswer('Q1', ['yes']),
      }

      const answersWithNo = {
        Q1: createAnswer('Q1', ['no']),
      }

      expect(isSectionVisible(section, answersWithYes)).toBe(true)
      expect(isSectionVisible(section, answersWithNo)).toBe(false)
    })

    it('should handle null visibility conditions', () => {
      const section = {
        visibilityConditions: null,
      }
      const answers = {}

      expect(isSectionVisible(section, answers)).toBe(true)
    })
  })

  describe('evaluateExpression', () => {
    describe('basic arithmetic', () => {
      it('should evaluate simple addition', () => {
        expect(evaluateExpression('2 + 3')).toBe(5)
        expect(evaluateExpression('10 + 20')).toBe(30)
      })

      it('should evaluate simple subtraction', () => {
        expect(evaluateExpression('10 - 3')).toBe(7)
        expect(evaluateExpression('100 - 50')).toBe(50)
      })

      it('should evaluate simple multiplication', () => {
        expect(evaluateExpression('4 * 5')).toBe(20)
        expect(evaluateExpression('7 * 8')).toBe(56)
      })

      it('should evaluate simple division', () => {
        expect(evaluateExpression('20 / 4')).toBe(5)
        expect(evaluateExpression('100 / 10')).toBe(10)
      })

      it('should handle decimal numbers', () => {
        expect(evaluateExpression('2.5 + 3.5')).toBe(6)
        expect(evaluateExpression('10.5 * 2')).toBe(21)
        expect(evaluateExpression('7.5 / 2.5')).toBe(3)
      })

      it('should handle negative numbers', () => {
        expect(evaluateExpression('-5 + 3')).toBe(-2)
        expect(evaluateExpression('-10 * 2')).toBe(-20)
        expect(evaluateExpression('-8 / 4')).toBe(-2)
      })
    })

    describe('operator precedence', () => {
      it('should respect multiplication precedence over addition', () => {
        expect(evaluateExpression('2 + 3 * 4')).toBe(14) // 2 + 12 = 14
        expect(evaluateExpression('10 + 5 * 2')).toBe(20) // 10 + 10 = 20
      })

      it('should respect division precedence over subtraction', () => {
        expect(evaluateExpression('20 - 10 / 2')).toBe(15) // 20 - 5 = 15
        expect(evaluateExpression('100 - 50 / 5')).toBe(90) // 100 - 10 = 90
      })

      it('should handle mixed operations with correct precedence', () => {
        expect(evaluateExpression('2 + 3 * 4 - 5')).toBe(9) // 2 + 12 - 5 = 9
        expect(evaluateExpression('10 / 2 + 3 * 4')).toBe(17) // 5 + 12 = 17
      })
    })

    describe('left-to-right associativity', () => {
      it('should evaluate left-to-right for subtraction', () => {
        expect(evaluateExpression('10 - 5 - 2')).toBe(3) // (10 - 5) - 2 = 3, not 10 - (5 - 2) = 7
        expect(evaluateExpression('20 - 10 - 5')).toBe(5) // (20 - 10) - 5 = 5, not 20 - (10 - 5) = 15
      })

      it('should evaluate left-to-right for division', () => {
        expect(evaluateExpression('20 / 4 / 2')).toBe(2.5) // (20 / 4) / 2 = 2.5, not 20 / (4 / 2) = 10
        expect(evaluateExpression('100 / 10 / 2')).toBe(5) // (100 / 10) / 2 = 5, not 100 / (10 / 2) = 20
      })

      it('should evaluate left-to-right for addition', () => {
        expect(evaluateExpression('1 + 2 + 3')).toBe(6)
        expect(evaluateExpression('5 + 10 + 15')).toBe(30)
      })

      it('should evaluate left-to-right for multiplication', () => {
        expect(evaluateExpression('2 * 3 * 4')).toBe(24)
        expect(evaluateExpression('5 * 2 * 3')).toBe(30)
      })
    })

    describe('parentheses', () => {
      it('should respect parentheses for grouping', () => {
        expect(evaluateExpression('(2 + 3) * 4')).toBe(20)
        expect(evaluateExpression('2 * (3 + 4)')).toBe(14)
      })

      it('should handle nested parentheses', () => {
        expect(evaluateExpression('((2 + 3) * 4) + 5')).toBe(25)
        expect(evaluateExpression('2 * ((3 + 4) * 5)')).toBe(70)
      })

      it('should handle multiple parentheses groups', () => {
        expect(evaluateExpression('(2 + 3) * (4 + 5)')).toBe(45)
        expect(evaluateExpression('(10 - 5) + (20 / 4)')).toBe(10)
      })
    })

    describe('whitespace handling', () => {
      it('should handle expressions with no spaces', () => {
        expect(evaluateExpression('2+3*4')).toBe(14)
        expect(evaluateExpression('10-5/2')).toBe(7.5)
      })

      it('should handle expressions with extra spaces', () => {
        expect(evaluateExpression('  2  +  3  ')).toBe(5)
        expect(evaluateExpression('10   *   5')).toBe(50)
      })
    })

    describe('complex expressions', () => {
      it('should evaluate complex multi-operation expressions', () => {
        expect(evaluateExpression('2 + 3 * 4 - 5 / 2')).toBe(11.5) // 2 + 12 - 2.5 = 11.5
        expect(evaluateExpression('(10 + 5) * 2 - 8 / 4')).toBe(28) // 15 * 2 - 2 = 28
      })

      it('should handle expressions with decimals and operators', () => {
        expect(evaluateExpression('10.5 + 2.5 * 4')).toBe(20.5) // 10.5 + 10 = 20.5
        expect(evaluateExpression('(7.5 - 2.5) / 2')).toBe(2.5) // 5 / 2 = 2.5
      })
    })
  })
})
