import type { CalculatorField } from '@island.is/clients/rsk/calculators'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '../models/enums'
import type {
  NumberInputField,
  SelectInputField,
} from '../models/inputField.model'
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

/* Only the boolean branch is reachable from real client data -- every
 * dependsOn across the six calculators is `equals: true` -- so the string and
 * number members of the union can only be covered here. */
describe('toDependencyValue', () => {
  it.each([
    [true, { value: true }],
    ['firstHalf', { value: 'firstHalf' }],
    [4, { value: 4 }],
  ] as const)('wraps %p as %p', (equals, expected) => {
    expect(toDependencyValue(equals)).toEqual(expected)
  })
})

/* Guards the client-contract-change tripwire: this Record is keyed on the
 * client's own literal union, so a new CalculatorFieldType stops compiling
 * here. The test pins that every current member is handled at runtime too. */
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
