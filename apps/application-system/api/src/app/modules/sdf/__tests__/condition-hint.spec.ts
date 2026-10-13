import { extractClientCondition } from '../condition-hint'
import { SdfComparators } from '@island.is/application/sdf-types'
import { Comparators, AllOrAny } from '@island.is/application/types'

describe('condition-hint comparator strings', () => {
  it('SdfComparators maps every Comparators enum value', () => {
    const comparatorValues = Object.values(Comparators)
    for (const comparator of comparatorValues) {
      expect(SdfComparators).toHaveProperty(comparator)
      expect(typeof SdfComparators[comparator as Comparators]).toBe('string')
    }
  })

  it('condition-hint uses SdfComparators, not hardcoded strings', () => {
    const staticCheck = {
      questionId: 'hasSpouse',
      comparator: Comparators.EQUALS,
      value: 'yes',
    }

    const hint = extractClientCondition(staticCheck)

    expect(hint).not.toBeNull()
    expect((hint as any).comparator).toBe(SdfComparators[Comparators.EQUALS])
    expect((hint as any).comparator).toBe('eq')
  })

  it('DynamicCheck (closure) returns null — no client condition', () => {
    const dynamicCheck = () => true
    const hint = extractClientCondition(dynamicCheck)
    expect(hint).toBeNull()
  })

  it('MultiConditionCheck with all StaticChecks emits multi hint', () => {
    const multiCheck = {
      isMultiCheck: true as const,
      show: true,
      on: AllOrAny.ALL,
      check: [
        {
          questionId: 'hasDependents',
          comparator: Comparators.EQUALS,
          value: 'yes',
        },
        {
          questionId: 'maritalStatus',
          comparator: Comparators.NOT_EQUAL,
          value: 'single',
        },
      ],
    }

    const hint = extractClientCondition(multiCheck)
    expect(hint).not.toBeNull()
    expect((hint as any).type).toBe('multi')
    expect((hint as any).on).toBe('all')
    expect((hint as any).checks).toHaveLength(2)
    expect((hint as any).checks[0].comparator).toBe('eq')
    expect((hint as any).checks[1].comparator).toBe('neq')
  })

  it('MultiConditionCheck with mixed closure/static returns null', () => {
    const mixedCheck = {
      isMultiCheck: true as const,
      show: true,
      on: AllOrAny.ALL,
      check: [
        {
          questionId: 'field',
          comparator: Comparators.EQUALS,
          value: 'yes',
        },
        () => true, // DynamicCheck mixed in
      ],
    }

    const hint = extractClientCondition(mixedCheck)
    expect(hint).toBeNull()
  })
})
