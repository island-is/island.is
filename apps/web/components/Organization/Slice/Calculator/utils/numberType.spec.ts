import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import { inputSemantic, outputSemantic } from './numberType'

describe('inputSemantic', () => {
  const numberField = {
    key: 'amount',
    type: TaxCalculatorInputFieldType.Number,
    required: false,
    semantic: TaxCalculatorInputFieldSemantic.Count,
  }

  it('replaces the contract semantic with the configured numberType', () => {
    expect(inputSemantic(numberField, 'percentage')).toBe(
      TaxCalculatorInputFieldSemantic.Percentage,
    )
  })

  it('maps plain to no semantic', () => {
    expect(inputSemantic(numberField, 'plain')).toBeUndefined()
  })

  it('falls back to the contract semantic when no numberType is configured', () => {
    expect(inputSemantic(numberField, undefined)).toBe(
      TaxCalculatorInputFieldSemantic.Count,
    )
  })

  it('ignores the numberType on a field that is not a number', () => {
    const selectField = {
      key: 'taxBracket',
      type: TaxCalculatorInputFieldType.Select,
      required: false,
    }

    expect(inputSemantic(selectField, 'percentage')).toBeUndefined()
  })
})

describe('outputSemantic', () => {
  const numberField = {
    key: 'total',
    type: TaxCalculatorOutputFieldType.Number,
    semantic: TaxCalculatorOutputFieldSemantic.Count,
  }

  it('replaces the contract semantic with the configured numberType', () => {
    expect(outputSemantic(numberField, 'currency')).toBe(
      TaxCalculatorOutputFieldSemantic.Currency,
    )
  })

  it('maps plain to no semantic', () => {
    expect(outputSemantic(numberField, 'plain')).toBeUndefined()
  })

  it('falls back to the contract semantic when no numberType is configured', () => {
    expect(outputSemantic(numberField, undefined)).toBe(
      TaxCalculatorOutputFieldSemantic.Count,
    )
  })

  it('ignores the numberType on a field that is not a number', () => {
    const stringField = {
      key: 'note',
      type: TaxCalculatorOutputFieldType.String,
    }

    expect(outputSemantic(stringField, 'currency')).toBeUndefined()
  })
})
