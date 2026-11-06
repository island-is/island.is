import type { CalculatorField } from '@island.is/clients/rsk/calculators'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '../../models/enums'
import type {
  NumberInputField,
  SelectInputField,
} from '../../models/inputField'
import { toDependencyValue, toInputField } from './inputField'

describe('toInputField', () => {
  it.each([
    ['number', TaxCalculatorInputFieldType.NUMBER],
    ['string', TaxCalculatorInputFieldType.STRING],
    ['boolean', TaxCalculatorInputFieldType.BOOLEAN],
    ['date', TaxCalculatorInputFieldType.DATE],
  ] as const)('maps client type %s to %s', (clientType, expected) => {
    const field = toInputField({
      name: 'field',
      type: clientType,
      required: true,
    })

    expect(field).toEqual({
      key: 'field',
      type: expected,
      required: true,
      dependsOn: undefined,
      ...(clientType === 'number' ? { semantic: undefined } : {}),
    })
  })

  it('carries a number semantic across', () => {
    const field = toInputField({
      name: 'incomeBase',
      type: 'number',
      required: true,
      semantic: 'currency',
    }) as NumberInputField

    expect(field.semantic).toBe(TaxCalculatorInputFieldSemantic.CURRENCY)
  })

  it.each([
    ['currency', undefined, undefined],
    ['percentage', 0, 100],
    ['month', 1, 12],
    ['count', 0, undefined],
  ] as const)(
    "exposes the %s semantic's bounds as min/max",
    (semantic, min, max) => {
      const field = toInputField({
        name: 'field',
        type: 'number',
        required: true,
        semantic,
      }) as NumberInputField

      expect(field.min).toBe(min)
      expect(field.max).toBe(max)
    },
  )

  it('structures select options and leaves other types without any', () => {
    const select = toInputField({
      name: 'period',
      type: 'select',
      required: true,
      options: [{ value: 'firstHalf' }, { value: 'secondHalf' }],
    }) as SelectInputField

    expect(select.options).toEqual([
      { value: 'firstHalf' },
      { value: 'secondHalf' },
    ])
    expect(
      toInputField({ name: 'plain', type: 'string', required: false }),
    ).not.toHaveProperty('options')
  })

  it('renames the dependency target to fieldKey', () => {
    const field = toInputField({
      name: 'splitCustodyChildrenOver7',
      type: 'number',
      required: false,
      dependsOn: { field: 'splitCustody', equals: true },
    })

    expect(field.dependsOn).toEqual({
      fieldKey: 'splitCustody',
      equals: { value: true },
    })
  })
})

describe('toDependencyValue', () => {
  it.each([
    [true, { value: true }],
    ['firstHalf', { value: 'firstHalf' }],
    [4, { value: 4 }],
  ] as const)('wraps %p as %p', (equals, expected) => {
    expect(toDependencyValue(equals)).toEqual(expected)
  })
})

/* Ensures every input field type is handled at runtime. */
describe('client type coverage', () => {
  it('handles every client field type', () => {
    const types: CalculatorField['type'][] = [
      'number',
      'string',
      'boolean',
      'date',
      'select',
    ]

    types.forEach((type) => {
      expect(() =>
        toInputField({
          name: 'field',
          type,
          required: false,
          ...(type === 'select' ? { options: [{ value: 'a' }] } : {}),
        }),
      ).not.toThrow()
    })
  })
})
