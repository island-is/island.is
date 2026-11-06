import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorType as ApiTaxCalculatorType } from '../../../graphql/schema'

const apiTypeByContentfulValue: Record<
  TaxCalculatorType,
  ApiTaxCalculatorType
> = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]:
    ApiTaxCalculatorType.WithholdingTaxOnWages,
  [TaxCalculatorType.CHILD_BENEFIT]: ApiTaxCalculatorType.ChildBenefit,
  [TaxCalculatorType.VEHICLE_TAX]: ApiTaxCalculatorType.VehicleTax,
  [TaxCalculatorType.VEHICLE_BENEFIT]: ApiTaxCalculatorType.VehicleBenefit,
}

const isTaxCalculatorType = (value: string): value is TaxCalculatorType =>
  Object.values<string>(TaxCalculatorType).includes(value)

export const toApiCalculatorType = (
  value: string,
): ApiTaxCalculatorType | undefined =>
  isTaxCalculatorType(value) ? apiTypeByContentfulValue[value] : undefined
