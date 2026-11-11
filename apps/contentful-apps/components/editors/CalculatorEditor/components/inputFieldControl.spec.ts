import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '../../../../graphql/schema'
import { controlForField, placeholderFor } from './inputFieldControl'

const contract = new Map([
  [
    'income',
    {
      key: 'income',
      type: TaxCalculatorInputFieldType.Number,
      semantic: TaxCalculatorInputFieldSemantic.Currency,
      required: false,
    },
  ],
  [
    'married',
    {
      key: 'married',
      type: TaxCalculatorInputFieldType.Boolean,
      required: false,
    },
  ],
])

const numberField = contract.get('income')
const booleanField = contract.get('married')

describe('controlForField', () => {
  it('uses the semantic unit when no number type is overridden', () => {
    expect(controlForField(numberField)).toEqual({
      kind: 'text',
      unit: { is: 'krónur', en: 'ISK' },
    })
  })

  it('lets a percentage override replace the semantic unit', () => {
    expect(controlForField(numberField, 'percentage')).toEqual({
      kind: 'text',
      unit: { is: '%', en: '%' },
    })
  })

  it('lets a year override make the field a choice', () => {
    expect(controlForField(numberField, 'year')).toEqual({ kind: 'choice' })
  })

  it('lets a plain override drop the unit', () => {
    expect(controlForField(numberField, 'plain')).toEqual({ kind: 'text' })
  })

  it('ignores the override on a non-number field', () => {
    expect(controlForField(booleanField, 'currency')).toEqual({
      kind: 'choice',
    })
  })
})

describe('placeholderFor', () => {
  it('returns the override unit as the placeholder', () => {
    expect(placeholderFor('income', contract, 'percentage')).toEqual({
      is: '%',
      en: '%',
    })
  })

  it('returns no placeholder when the override is a choice', () => {
    expect(placeholderFor('income', contract, 'year')).toBeUndefined()
  })
})
