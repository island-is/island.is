import { TaxCalculatorType } from './models/enums'
import { FieldDefinition } from './utils/fieldDefinition'
import { withholdingTaxFields } from './calculators/withholdingTax.fields'
import { childBenefitFields } from './calculators/childBenefit.fields'
import { vehicleTaxFields } from './calculators/vehicleTax.fields'
import { vehicleBenefitFields } from './calculators/vehicleBenefit.fields'

export const fieldsByCalculatorType: Record<
  TaxCalculatorType,
  FieldDefinition[]
> = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: withholdingTaxFields,
  [TaxCalculatorType.CHILD_BENEFIT]: childBenefitFields,
  [TaxCalculatorType.VEHICLE_TAX]: vehicleTaxFields,
  [TaxCalculatorType.VEHICLE_BENEFIT]: vehicleBenefitFields,
}
