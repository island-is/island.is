import type { CalculatorOutputField } from '@island.is/clients/rsk/calculators'

import { TaxCalculatorOutputFieldType } from '../models/enums'
import { toOutputValues } from './outputValue'

const fields: readonly CalculatorOutputField[] = [
  { name: 'total', kind: 'scalar', type: 'number', semantic: 'currency' },
  { name: 'label', kind: 'scalar', type: 'string' },
  { name: 'dueDate', kind: 'scalar', type: 'date' },
  { name: 'applied', kind: 'scalar', type: 'boolean' },
  {
    name: 'brackets',
    kind: 'array',
    itemFields: [
      { name: 'lowerBound', kind: 'scalar', type: 'number' },
      { name: 'rate', kind: 'scalar', type: 'number' },
    ],
  },
]

const { NUMBER, STRING, BOOLEAN, DATE, ARRAY } = TaxCalculatorOutputFieldType

describe('toOutputValues', () => {
  it('maps each scalar kind onto its own payload field', () => {
    expect(
      toOutputValues(fields, {
        total: 1234,
        label: 'First half',
        dueDate: '2026-06-01',
        applied: true,
      }),
    ).toEqual([
      { key: 'total', type: NUMBER, numberValue: 1234 },
      { key: 'label', type: STRING, stringValue: 'First half' },
      { key: 'dueDate', type: DATE, stringValue: '2026-06-01' },
      { key: 'applied', type: BOOLEAN, booleanValue: true },
    ])
  })

  it('preserves zero and false rather than omitting them', () => {
    expect(toOutputValues(fields, { total: 0, applied: false })).toEqual([
      { key: 'total', type: NUMBER, numberValue: 0 },
      { key: 'applied', type: BOOLEAN, booleanValue: false },
    ])
  })

  it('omits scalars RSK returned no value for', () => {
    expect(toOutputValues(fields, { total: 1 })).toEqual([
      { key: 'total', type: NUMBER, numberValue: 1 },
    ])
  })

  it('ignores result keys the contract does not declare', () => {
    expect(toOutputValues(fields, { total: 1, surprise: 'ignored' })).toEqual([
      { key: 'total', type: NUMBER, numberValue: 1 },
    ])
  })

  /* Client drift should read as a missing value, not a coerced one. */
  it('omits a value whose runtime kind contradicts the contract', () => {
    expect(toOutputValues(fields, { total: '1234' })).toEqual([])
  })

  describe('array fields', () => {
    it('maps rows keyed by item field', () => {
      expect(
        toOutputValues(fields, {
          brackets: [
            { lowerBound: 0, rate: 31.45 },
            { lowerBound: 446136, rate: 37.95 },
          ],
        }),
      ).toEqual([
        {
          key: 'brackets',
          type: ARRAY,
          arrayValue: [
            {
              values: [
                { key: 'lowerBound', type: NUMBER, numberValue: 0 },
                { key: 'rate', type: NUMBER, numberValue: 31.45 },
              ],
            },
            {
              values: [
                { key: 'lowerBound', type: NUMBER, numberValue: 446136 },
                { key: 'rate', type: NUMBER, numberValue: 37.95 },
              ],
            },
          ],
        },
      ])
    })

    /* An empty array is a result; a missing one is a missing value. */
    it('publishes an empty array as an empty list', () => {
      expect(toOutputValues(fields, { brackets: [] })).toEqual([
        { key: 'brackets', type: ARRAY, arrayValue: [] },
      ])
    })

    it('omits an array the result does not carry', () => {
      expect(toOutputValues(fields, {})).toEqual([])
    })

    it('omits row values the row does not carry', () => {
      expect(toOutputValues(fields, { brackets: [{ rate: 31.45 }] })).toEqual([
        {
          key: 'brackets',
          type: ARRAY,
          arrayValue: [
            { values: [{ key: 'rate', type: NUMBER, numberValue: 31.45 }] },
          ],
        },
      ])
    })
  })

  it('follows contract order rather than result order', () => {
    const keys = toOutputValues(fields, {
      applied: true,
      label: 'x',
      total: 1,
    }).map((value) => value.key)

    expect(keys).toEqual(['total', 'label', 'applied'])
  })
})
