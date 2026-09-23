import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import type { OutputRow, OutputValue } from './outputValues'
import { itemValue, toOutputValues } from './outputValues'

const scalar = (key: string, numberValue: number) => ({
  key,
  type: TaxCalculatorOutputFieldType.Number,
  numberValue,
})

const values: OutputValue[] = [
  { key: 'total', type: TaxCalculatorOutputFieldType.Number, numberValue: 42 },
  {
    key: 'months',
    type: TaxCalculatorOutputFieldType.Array,
    arrayValue: [{ values: [scalar('month', 1), scalar('amount', 100)] }],
  },
]

describe('toOutputValues', () => {
  it('keys the response by output field key', () => {
    const lookup = toOutputValues({
      type: 'childBenefit' as never,
      values,
    })

    expect(lookup.get('total')?.numberValue).toBe(42)
    expect(lookup.get('months')?.arrayValue?.length).toBe(1)
  })

  it('has no entry for a key the calculation did not return', () => {
    const lookup = toOutputValues({ type: 'childBenefit' as never, values })

    expect(lookup.has('unpaid')).toBe(false)
  })
})

describe('itemValue', () => {
  it('finds an item by key in a row that skipped an earlier one', () => {
    const row: OutputRow = { values: [scalar('amount', 100)] }

    expect(itemValue(row, 'amount')?.numberValue).toBe(100)
    expect(itemValue(row, 'month')).toBeUndefined()
  })
})
