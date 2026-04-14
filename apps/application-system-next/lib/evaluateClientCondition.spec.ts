import {
  SDF_CMP_EQUALS,
  SDF_CMP_NOT_EQUAL,
  SDF_CMP_GT,
  SDF_CMP_GTE,
  SDF_CMP_LT,
  SDF_CMP_LTE,
  SDF_CMP_CONTAINS,
  SDF_CMP_NOT_CONTAINS,
} from '@island.is/application/sdf-types'
import { evaluateClientCondition } from './evaluateClientCondition'

describe('evaluateClientCondition', () => {
  it('returns true when condition is null/undefined', () => {
    expect(evaluateClientCondition(null, {})).toBe(true)
    expect(evaluateClientCondition(undefined, {})).toBe(true)
  })

  it('evaluates EQUALS correctly', () => {
    const condition = {
      questionId: 'status',
      comparator: SDF_CMP_EQUALS,
      value: 'married',
    }
    expect(evaluateClientCondition(condition, { status: 'married' })).toBe(true)
    expect(evaluateClientCondition(condition, { status: 'single' })).toBe(false)
  })

  it('evaluates NOT_EQUAL correctly', () => {
    const condition = {
      questionId: 'status',
      comparator: SDF_CMP_NOT_EQUAL,
      value: 'single',
    }
    expect(evaluateClientCondition(condition, { status: 'married' })).toBe(true)
    expect(evaluateClientCondition(condition, { status: 'single' })).toBe(false)
  })

  it('evaluates GT correctly', () => {
    const condition = {
      questionId: 'age',
      comparator: SDF_CMP_GT,
      value: '18',
    }
    expect(evaluateClientCondition(condition, { age: 19 })).toBe(true)
    expect(evaluateClientCondition(condition, { age: 18 })).toBe(false)
  })

  it('evaluates GTE correctly', () => {
    const condition = {
      questionId: 'income',
      comparator: SDF_CMP_GTE,
      value: '500000',
    }
    expect(evaluateClientCondition(condition, { income: 500000 })).toBe(true)
    expect(evaluateClientCondition(condition, { income: 499999 })).toBe(false)
  })

  it('evaluates LT correctly', () => {
    const condition = {
      questionId: 'children',
      comparator: SDF_CMP_LT,
      value: '5',
    }
    expect(evaluateClientCondition(condition, { children: 4 })).toBe(true)
    expect(evaluateClientCondition(condition, { children: 5 })).toBe(false)
  })

  it('evaluates LTE correctly', () => {
    const condition = {
      questionId: 'debt',
      comparator: SDF_CMP_LTE,
      value: '0',
    }
    expect(evaluateClientCondition(condition, { debt: 0 })).toBe(true)
    expect(evaluateClientCondition(condition, { debt: 1 })).toBe(false)
  })

  it('evaluates CONTAINS correctly', () => {
    const condition = {
      questionId: 'selectedItems',
      comparator: SDF_CMP_CONTAINS,
      value: 'car',
    }
    expect(
      evaluateClientCondition(condition, { selectedItems: ['car', 'bike'] }),
    ).toBe(true)
    expect(
      evaluateClientCondition(condition, { selectedItems: ['bike'] }),
    ).toBe(false)
  })

  it('evaluates NOT_CONTAINS correctly', () => {
    const condition = {
      questionId: 'selectedItems',
      comparator: SDF_CMP_NOT_CONTAINS,
      value: 'car',
    }
    expect(
      evaluateClientCondition(condition, { selectedItems: ['bike'] }),
    ).toBe(true)
    expect(
      evaluateClientCondition(condition, { selectedItems: ['car', 'bike'] }),
    ).toBe(false)
  })

  it('evaluates ALL multi-check correctly', () => {
    const condition = {
      on: 'ALL' as const,
      checks: [
        {
          questionId: 'hasDependents',
          comparator: SDF_CMP_EQUALS,
          value: 'yes',
        },
        {
          questionId: 'maritalStatus',
          comparator: SDF_CMP_NOT_EQUAL,
          value: 'single',
        },
      ],
    }
    expect(
      evaluateClientCondition(condition, {
        hasDependents: 'yes',
        maritalStatus: 'married',
      }),
    ).toBe(true)
    expect(
      evaluateClientCondition(condition, {
        hasDependents: 'yes',
        maritalStatus: 'single',
      }),
    ).toBe(false)
  })

  it('evaluates ANY multi-check correctly', () => {
    const condition = {
      on: 'ANY' as const,
      checks: [
        {
          questionId: 'status',
          comparator: SDF_CMP_EQUALS,
          value: 'married',
        },
        {
          questionId: 'status',
          comparator: SDF_CMP_EQUALS,
          value: 'cohabiting',
        },
      ],
    }
    expect(
      evaluateClientCondition(condition, { status: 'cohabiting' }),
    ).toBe(true)
    expect(
      evaluateClientCondition(condition, { status: 'single' }),
    ).toBe(false)
  })

  it('returns true for unknown comparator', () => {
    const condition = {
      questionId: 'x',
      comparator: 'UNKNOWN',
      value: '1',
    }
    expect(evaluateClientCondition(condition, { x: '1' })).toBe(true)
  })
})
