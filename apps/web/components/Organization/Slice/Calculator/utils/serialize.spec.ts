import { TaxCalculatorInputFieldType } from '@island.is/web/graphql/schema'

import type { InputContractField } from '../contract'
import type { ApplicableField, ApplicableFields } from './applicability'
import { toInputFieldValues } from './serialize'

const entry = (
  key: string,
  type: TaxCalculatorInputFieldType,
  overrides: Partial<ApplicableField> = {},
): ApplicableField => {
  const contractField: InputContractField = { key, type, required: false }

  return {
    field: { uid: `uid-${key}`, key, span: 6 },
    contractField,
    label: key,
    disabled: false,
    ...overrides,
  }
}

const applicable = (...entries: ApplicableField[]): ApplicableFields =>
  new Map(entries.map((item) => [item.contractField.key, item]))

describe('toInputFieldValues', () => {
  it('chooses the one-of member from metadata type, not from the control', () => {
    const rows = toInputFieldValues(
      applicable(
        entry('salary', TaxCalculatorInputFieldType.Number),
        entry('note', TaxCalculatorInputFieldType.String),
        entry('isMarried', TaxCalculatorInputFieldType.Boolean),
        entry('bracket', TaxCalculatorInputFieldType.Select),
      ),
      {
        salary: '1000000',
        note: 'hali',
        isMarried: true,
        bracket: '4%',
      },
    )

    expect(rows).toEqual([
      { key: 'salary', value: { numberValue: 1000000 } },
      { key: 'note', value: { stringValue: 'hali' } },
      { key: 'isMarried', value: { booleanValue: true } },
      { key: 'bracket', value: { stringValue: '4%' } },
    ])
  })

  it('coerces a number-typed field that a select filled with a string', () => {
    const rows = toInputFieldValues(
      applicable(entry('incomeYear', TaxCalculatorInputFieldType.Number)),
      { incomeYear: '2024' },
    )

    expect(rows).toEqual([{ key: 'incomeYear', value: { numberValue: 2024 } }])
  })

  it('submits a date unchanged', () => {
    const rows = toInputFieldValues(
      applicable(entry('startDate', TaxCalculatorInputFieldType.Date)),
      { startDate: '2026-03-14' },
    )

    expect(rows).toEqual([
      { key: 'startDate', value: { stringValue: '2026-03-14' } },
    ])
  })

  it('preserves a submitted zero and a submitted false', () => {
    const rows = toInputFieldValues(
      applicable(
        entry('childCount', TaxCalculatorInputFieldType.Number),
        entry('isMarried', TaxCalculatorInputFieldType.Boolean),
      ),
      { childCount: '0', isMarried: false },
    )

    expect(rows).toEqual([
      { key: 'childCount', value: { numberValue: 0 } },
      { key: 'isMarried', value: { booleanValue: false } },
    ])
  })

  it('omits an untouched numeric field rather than submitting a zero', () => {
    const rows = toInputFieldValues(
      applicable(entry('salary', TaxCalculatorInputFieldType.Number)),
      { salary: '' },
    )

    expect(rows).toEqual([])
  })

  it('omits a field with no value at all', () => {
    const rows = toInputFieldValues(
      applicable(
        entry('a', TaxCalculatorInputFieldType.String),
        entry('b', TaxCalculatorInputFieldType.String),
      ),
      { a: null, b: undefined },
    )

    expect(rows).toEqual([])
  })

  it('does not submit a rendered but disabled field', () => {
    const rows = toInputFieldValues(
      applicable(
        entry('note', TaxCalculatorInputFieldType.String, { disabled: true }),
      ),
      { note: 'hali' },
    )

    expect(rows).toEqual([])
  })

  it('never emits a row carrying more than one member', () => {
    const rows = toInputFieldValues(
      applicable(entry('salary', TaxCalculatorInputFieldType.Number)),
      { salary: '10' },
    )

    expect(Object.keys(rows[0].value)).toEqual(['numberValue'])
  })
})
