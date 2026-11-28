import { Comparators } from '@island.is/application/types'
import { SdfComparators } from '../SdfComparators'

describe('SdfComparators — exhaustive coverage of Comparators enum', () => {
  it('maps every Comparators enum value to a defined key in SdfComparators', () => {
    const allComparatorValues = Object.values(Comparators)

    for (const comparator of allComparatorValues) {
      expect(SdfComparators).toHaveProperty(comparator)
      expect(typeof SdfComparators[comparator]).toBe('string')
      expect(SdfComparators[comparator].length).toBeGreaterThan(0)
    }
  })

  it('has no extra keys beyond Comparators enum values', () => {
    const comparatorValues = new Set(Object.values(Comparators))
    const sdfKeys = Object.keys(SdfComparators)

    for (const key of sdfKeys) {
      expect(comparatorValues.has(key as Comparators)).toBe(true)
    }
  })

  it('maps known comparators to expected wire-format strings', () => {
    expect(SdfComparators[Comparators.EQUALS]).toBe('eq')
    expect(SdfComparators[Comparators.NOT_EQUAL]).toBe('neq')
    expect(SdfComparators[Comparators.GT]).toBe('gt')
    expect(SdfComparators[Comparators.GTE]).toBe('gte')
    expect(SdfComparators[Comparators.LT]).toBe('lt')
    expect(SdfComparators[Comparators.LTE]).toBe('lte')
    expect(SdfComparators[Comparators.CONTAINS]).toBe('in')
    expect(SdfComparators[Comparators.NOT_CONTAINS]).toBe('nin')
  })
})
