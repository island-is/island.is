import type { CalculatorOutputScalarType } from '@island.is/clients/rsk/calculators'

import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '../models/enums'
import type {
  ArrayOutputField,
  NumberOutputField,
} from '../models/outputField.model'
import { toOutputField, toOutputScalarField } from './outputField'

describe('toOutputField', () => {
  it.each([
    ['number', TaxCalculatorOutputFieldType.NUMBER],
    ['string', TaxCalculatorOutputFieldType.STRING],
    ['boolean', TaxCalculatorOutputFieldType.BOOLEAN],
    ['date', TaxCalculatorOutputFieldType.DATE],
  ] as const)('maps client scalar type %s to %s', (clientType, expected) => {
    const field = toOutputField({
      name: 'field',
      kind: 'scalar',
      type: clientType,
    })

    expect(field).toEqual({
      key: 'field',
      type: expected,
      ...(clientType === 'number' ? { semantic: undefined } : {}),
    })
  })

  it('carries a number semantic across', () => {
    const field = toOutputField({
      name: 'monthlyBenefit',
      kind: 'scalar',
      type: 'number',
      semantic: 'currency',
    }) as NumberOutputField

    expect(field.semantic).toBe(TaxCalculatorOutputFieldSemantic.CURRENCY)
  })

  it('renames the client name to key and exposes no client kind', () => {
    const field = toOutputField({
      name: 'periodLabel',
      kind: 'scalar',
      type: 'string',
    })

    expect(field.key).toBe('periodLabel')
    expect(field).not.toHaveProperty('kind')
    expect(field).not.toHaveProperty('name')
  })

  it('maps an array output to itemFields, reusing the scalar mapper', () => {
    const field = toOutputField({
      name: 'taxBrackets',
      kind: 'array',
      itemFields: [
        {
          name: 'lowerBound',
          kind: 'scalar',
          type: 'number',
          semantic: 'currency',
        },
        {
          name: 'withholdingRate',
          kind: 'scalar',
          type: 'number',
          semantic: 'percentage',
        },
        { name: 'label', kind: 'scalar', type: 'string' },
      ],
    }) as ArrayOutputField

    expect(field.key).toBe('taxBrackets')
    expect(field.type).toBe(TaxCalculatorOutputFieldType.ARRAY)
    expect(field.itemFields).toEqual([
      {
        key: 'lowerBound',
        type: TaxCalculatorOutputFieldType.NUMBER,
        semantic: TaxCalculatorOutputFieldSemantic.CURRENCY,
      },
      {
        key: 'withholdingRate',
        type: TaxCalculatorOutputFieldType.NUMBER,
        semantic: TaxCalculatorOutputFieldSemantic.PERCENTAGE,
      },
      { key: 'label', type: TaxCalculatorOutputFieldType.STRING },
    ])
  })

  /* An array output carries no `semantic` of its own -- the semantic belongs to
   * the individual item fields, which is what distinguishes a row's columns. */
  it('puts no semantic on the array field itself', () => {
    const field = toOutputField({
      name: 'taxBrackets',
      kind: 'array',
      itemFields: [{ name: 'amount', kind: 'scalar', type: 'number' }],
    })

    expect(field).not.toHaveProperty('semantic')
  })
})

/* Guards the client-contract-change tripwire: the Record in this module is
 * keyed on the client's own literal union, so a new CalculatorOutputScalarType
 * stops compiling there. This pins that every current member is handled at
 * runtime too. */
describe('client output type coverage', () => {
  it('handles every client scalar output type', () => {
    const types: CalculatorOutputScalarType[] = [
      'number',
      'string',
      'boolean',
      'date',
    ]

    types.forEach((type) => {
      expect(() =>
        toOutputScalarField({ name: 'field', kind: 'scalar', type }),
      ).not.toThrow()
    })
  })
})
