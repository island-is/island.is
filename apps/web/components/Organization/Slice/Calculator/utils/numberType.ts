import type { CalculatorNumberType } from '@island.is/tax-calculators'
import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import type {
  InputContractField,
  OutputContractField,
  OutputContractItemField,
} from '../contract'

const INPUT_SEMANTIC: Record<
  CalculatorNumberType,
  TaxCalculatorInputFieldSemantic | undefined
> = {
  currency: TaxCalculatorInputFieldSemantic.Currency,
  count: TaxCalculatorInputFieldSemantic.Count,
  year: TaxCalculatorInputFieldSemantic.Year,
  percentage: TaxCalculatorInputFieldSemantic.Percentage,
  plain: undefined,
}

const OUTPUT_SEMANTIC: Record<
  CalculatorNumberType,
  TaxCalculatorOutputFieldSemantic | undefined
> = {
  currency: TaxCalculatorOutputFieldSemantic.Currency,
  count: TaxCalculatorOutputFieldSemantic.Count,
  year: TaxCalculatorOutputFieldSemantic.Year,
  percentage: TaxCalculatorOutputFieldSemantic.Percentage,
  plain: undefined,
}

export const inputSemantic = (
  field: InputContractField,
  numberType: CalculatorNumberType | undefined,
) =>
  numberType && field.type === TaxCalculatorInputFieldType.Number
    ? INPUT_SEMANTIC[numberType]
    : field.semantic

export const outputSemantic = (
  field: OutputContractField | OutputContractItemField,
  numberType: CalculatorNumberType | undefined,
) =>
  numberType && field.type === TaxCalculatorOutputFieldType.Number
    ? OUTPUT_SEMANTIC[numberType]
    : field.semantic
