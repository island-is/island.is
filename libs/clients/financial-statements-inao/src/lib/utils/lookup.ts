import { FinancialType } from '../types'

export type LookupType = {
  star_value: number
  'star_FinancialType@odata.bind': string
}

export function lookup(
  lookupValue: number,
  value: number,
  financialTypes: FinancialType[],
): LookupType {
  const fType = financialTypes?.find(
    (x) => x.numericValue === lookupValue,
  )?.financialTypeId

  const res = {
    star_value: value,
    'star_FinancialType@odata.bind': `/star_financialtypes(${fType})`,
  }
  return res
}
