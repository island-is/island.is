import { TaxCalculatorOutputFieldType } from '../enums'

export type ScalarOutputFieldType = Exclude<
  TaxCalculatorOutputFieldType,
  TaxCalculatorOutputFieldType.ARRAY
>
